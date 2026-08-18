import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { User, UserManager } from 'oidc-client-ts';
import { throwableToError } from '@chubbyts/chubbyts-throwable-to-error/dist/throwable-to-error';

export type OidcProviderProps = {
  userManager: UserManager;
  onSigninCallback?: (user: User | undefined) => Promise<void> | void;
};

export type Oidc = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: Error;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

type OidcState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | undefined;
};

const OidcContext = createContext<Oidc | undefined>(undefined);

// check if returning back from authority server (response_mode: query)
const hasAuthParams = (): boolean => {
  const searchParams = new URLSearchParams(window.location.search);

  return Boolean((searchParams.get('code') || searchParams.get('error')) && searchParams.get('state'));
};

export const OidcProvider: FC<PropsWithChildren<OidcProviderProps>> = ({
  userManager,
  onSigninCallback,
  children,
}: PropsWithChildren<OidcProviderProps>) => {
  const [state, setState] = useState<OidcState>({ isLoading: true, isAuthenticated: false, error: undefined });
  const didInitialize = useRef<boolean>(false);

  const patchState = useCallback((patch: Partial<OidcState>): void => {
    setState((currentState) => ({ ...currentState, ...patch }));
  }, []);

  useEffect(() => {
    // event UserLoaded (e.g. initial load, silent renew success)
    const handleUserLoaded = (user: User): void => {
      patchState({ isLoading: false, isAuthenticated: !user.expired, error: undefined });
    };

    // event UserUnloaded (e.g. userManager.removeUser) / UserSignedOut (e.g. user was signed out in background)
    const handleUserUnloaded = (): void => {
      patchState({ isAuthenticated: false });
    };

    // event SilentRenewError (silent renew error)
    const handleSilentRenewError = (error: Error): void => {
      patchState({ isLoading: false, error });
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addUserSignedOut(handleUserUnloaded);
    userManager.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeUserSignedOut(handleUserUnloaded);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [userManager, patchState]);

  useEffect(() => {
    // the signin callback must only run once, even if the effect runs twice (react strict mode)
    if (didInitialize.current) {
      return;
    }

    // oxlint-disable-next-line functional/immutable-data
    didInitialize.current = true;

    const signinCallback = async (): Promise<User | undefined> => {
      const user = await userManager.signinCallback();

      if (onSigninCallback) {
        await onSigninCallback(user);
      }

      return user;
    };

    const initialize = async (): Promise<void> => {
      try {
        const signedInUser = hasAuthParams() ? await signinCallback() : undefined;
        const user = signedInUser ?? (await userManager.getUser());

        patchState({ isLoading: false, isAuthenticated: user ? !user.expired : false, error: undefined });
      } catch (error) {
        patchState({ isLoading: false, error: throwableToError(error) });
      }
    };

    void initialize();
  }, [userManager, onSigninCallback, patchState]);

  const navigate = useCallback(
    async (callback: () => Promise<void>): Promise<void> => {
      patchState({ isLoading: true });

      try {
        await callback();
      } catch (error) {
        patchState({ error: throwableToError(error) });
      } finally {
        patchState({ isLoading: false });
      }
    },
    [patchState],
  );

  const oidc = useMemo<Oidc>(
    () => ({
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      error: state.error,
      // return to the current page after the login
      login: () =>
        navigate(() =>
          userManager.signinRedirect({ redirect_uri: `${window.location.origin}${window.location.pathname}` }),
        ),
      logout: () => navigate(() => userManager.signoutRedirect()),
    }),
    [state, userManager, navigate],
  );

  return <OidcContext.Provider value={oidc}>{children}</OidcContext.Provider>;
};

export const useOidc = (): Oidc => {
  const oidc = useContext(OidcContext);

  if (!oidc) {
    throw new Error('useOidc must be used within an OidcProvider');
  }

  return oidc;
};
