import { useAuth } from 'react-oidc-context';

export const LoginButton = () => {
  const auth = useAuth();
  return <button onClick={() => auth.signinRedirect()}>Log in</button>;
};

export const LogoutButton = () => {
  const auth = useAuth();
  return <button onClick={() => auth.signoutRedirect()}>Log out</button>;
};
