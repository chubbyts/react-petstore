import { afterEach, describe, expect, test } from 'vitest';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { getAccessToken, oidcConfig, onSigninCallback, userManager } from '../src/oidc';

describe('oidc', () => {
  afterEach(async () => {
    await userManager.removeUser();
  });

  test('userManager', () => {
    expect(userManager).toBeInstanceOf(UserManager);

    expect(userManager.settings).toMatchObject({
      authority: 'https://keycloak.test/realms/petstore',
      client_id: 'petstore-frontend',
      redirect_uri: 'http://localhost:3000/',
      post_logout_redirect_uri: 'http://localhost:3000/',
      scope: 'openid profile email',
    });

    expect(userManager.settings.userStore).toBeInstanceOf(WebStorageStateStore);
  });

  test('oidcConfig', () => {
    expect(oidcConfig).toEqual({ userManager, onSigninCallback });
  });

  test('onSigninCallback', () => {
    window.history.replaceState({}, '', '/pet?code=code&state=state');

    expect(window.location.href).toBe('http://localhost:3000/pet?code=code&state=state');

    onSigninCallback();

    expect(window.location.href).toBe('http://localhost:3000/pet');
  });

  test('getAccessToken without user', async () => {
    expect(await getAccessToken()).toBeUndefined();
  });

  test('getAccessToken with user', async () => {
    await userManager.storeUser(
      new User({
        access_token: 'access-token',
        token_type: 'Bearer',
        profile: { sub: 'sub', iss: 'iss', aud: 'aud', exp: 1, iat: 1 },
      }),
    );

    expect(await getAccessToken()).toBe('access-token');
  });
});
