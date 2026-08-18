import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { InMemoryWebStorage, User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type { OidcProviderProps } from '../../src/hook/use-oidc';
import { OidcProvider, useOidc } from '../../src/hook/use-oidc';

const userManager = new UserManager({
  authority: 'https://keycloak.test/realms/petstore',
  client_id: 'petstore-frontend',
  redirect_uri: 'http://localhost:3000/',
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
  automaticSilentRenew: false,
});

const createUser = (expiresAt: number): User => {
  return new User({
    access_token: 'access-token',
    token_type: 'Bearer',
    expires_at: expiresAt,
    profile: { sub: 'sub', iss: 'iss', aud: 'aud', exp: 1, iat: 1 },
  });
};

const createValidUser = (): User => createUser(Math.floor(Date.now() / 1000) + 3600);
const createExpiredUser = (): User => createUser(Math.floor(Date.now() / 1000) - 3600);

const renderUseOidc = (props: Partial<OidcProviderProps> = {}) => {
  return renderHook(useOidc, {
    wrapper: ({ children }: PropsWithChildren) => (
      <OidcProvider userManager={userManager} {...props}>
        {children}
      </OidcProvider>
    ),
  });
};

describe('use-oidc', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
    await userManager.removeUser();
  });

  test('without provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(useOidc)).toThrow('useOidc must be used within an OidcProvider');
  });

  test('unauthenticated', async () => {
    const signinRedirect = vi.spyOn(userManager, 'signinRedirect').mockResolvedValue();

    const { result } = renderUseOidc();

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeUndefined();

    window.history.replaceState({}, '', '/pet?page=2');

    await act(() => result.current.login());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();

    expect(signinRedirect).toHaveBeenCalledTimes(1);
    expect(signinRedirect).toHaveBeenNthCalledWith(1, { redirect_uri: 'http://localhost:3000/pet' });
  });

  test('login error', async () => {
    const signinRedirect = vi.spyOn(userManager, 'signinRedirect').mockRejectedValue(new Error('signin failed'));

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error?.message).toBe('signin failed');

    expect(signinRedirect).toHaveBeenCalledTimes(1);
  });

  test('authenticated', async () => {
    await userManager.storeUser(createValidUser());

    const signoutRedirect = vi.spyOn(userManager, 'signoutRedirect').mockResolvedValue();

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeUndefined();

    await act(() => result.current.logout());

    expect(result.current.isLoading).toBe(false);

    expect(signoutRedirect).toHaveBeenCalledTimes(1);
    expect(signoutRedirect).toHaveBeenNthCalledWith(1);
  });

  test('expired', async () => {
    await userManager.storeUser(createExpiredUser());

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  test('signin callback', async () => {
    window.history.replaceState({}, '', '/pet?code=code&state=state');

    const user = createValidUser();

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockResolvedValue(user);
    const onSigninCallback = vi.fn();

    const { result } = renderUseOidc({ onSigninCallback });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeUndefined();

    expect(signinCallback).toHaveBeenCalledTimes(1);
    expect(onSigninCallback).toHaveBeenCalledTimes(1);
    expect(onSigninCallback).toHaveBeenNthCalledWith(1, user);
  });

  test('signin callback only once', async () => {
    window.history.replaceState({}, '', '/pet?code=code&state=state');

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockResolvedValue(createValidUser());

    // oxlint-disable-next-line functional/no-let
    let onSigninCallback = vi.fn();

    const { result, rerender } = renderHook(useOidc, {
      wrapper: ({ children }: PropsWithChildren) => (
        <OidcProvider userManager={userManager} onSigninCallback={onSigninCallback}>
          {children}
        </OidcProvider>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);

    // a changed onSigninCallback reruns the effect, but must not rerun the signin callback (same as react strict mode)
    onSigninCallback = vi.fn();
    rerender();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeUndefined();

    expect(signinCallback).toHaveBeenCalledTimes(1);
  });

  test('signin callback without user and without onSigninCallback', async () => {
    window.history.replaceState({}, '', '/pet?error=access_denied&state=state');

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockResolvedValue(undefined);

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeUndefined();

    expect(signinCallback).toHaveBeenCalledTimes(1);
  });

  test('signin callback error', async () => {
    window.history.replaceState({}, '', '/pet?code=code&state=state');

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockRejectedValue(new Error('invalid_grant'));

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error?.message).toBe('invalid_grant');

    expect(signinCallback).toHaveBeenCalledTimes(1);
  });

  test('events', async () => {
    const { result } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);

    // event UserLoaded
    await act(() => userManager.events.load(createValidUser()));

    expect(result.current.isAuthenticated).toBe(true);

    // event UserUnloaded
    await act(() => userManager.events.unload());

    expect(result.current.isAuthenticated).toBe(false);

    await act(() => userManager.events.load(createValidUser()));

    expect(result.current.isAuthenticated).toBe(true);

    // event UserSignedOut
    // oxlint-disable-next-line eslint/no-underscore-dangle
    await act(() => userManager.events._raiseUserSignedOut());

    expect(result.current.isAuthenticated).toBe(false);

    // event SilentRenewError
    // oxlint-disable-next-line eslint/no-underscore-dangle
    await act(() => userManager.events._raiseSilentRenewError(new Error('silent renew failed')));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error?.message).toBe('silent renew failed');
  });

  test('unmount', async () => {
    const { result, unmount } = renderUseOidc();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    unmount();

    // events after unmount must not update the state anymore
    await act(() => userManager.events.load(createValidUser()));

    expect(result.current.isAuthenticated).toBe(false);
  });
});
