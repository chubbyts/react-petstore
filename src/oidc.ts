import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type { OidcProviderProps } from './hook/use-oidc';

export const userManager = new UserManager({
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: `${window.location.origin}/`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
});

// remove the code and state parameters from the url after a successful signin
export const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const oidcConfig: OidcProviderProps = {
  userManager,
  onSigninCallback,
};

export const getAccessToken = async (): Promise<string | undefined> => {
  const user = await userManager.getUser();

  return user?.access_token;
};
