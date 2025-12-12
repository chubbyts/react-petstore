import type React from 'react';
import { AuthProvider } from 'react-oidc-context';

const oidcConfig = {
  authority: 'http://localhost:9000/application/o/petstore',
  client_id: 'zOz03ErnZoY1KbWiGMaUypCRRcBeltxa5NVBokdZ',
  redirect_uri: `${window.location.origin}/auth/callback`,
  response_type: 'code',
  scope: 'openid profile email groups',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, '/');
  },
};

export const OidcProviderWrapper: React.FC<{ children: React.ReactNode; }> = ({ children }) => (
  <AuthProvider {...oidcConfig}>{children}</AuthProvider>
);
