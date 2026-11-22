import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Routes from './routes';
import { useOidc } from './hook/use-oidc';
import { usePetCountQuery } from './hook/use-pet-count-query';
import { PageError } from './component/partial/page-error';
import { PageErrorProvider } from './hook/use-page-error';
import { HttpError } from './client/error';
import { H1 } from './component/heading';
import { Button } from './component/button';
import { Card, CardBody } from './component/card';
import { LogOutIcon, PawIcon } from './component/icon';
import { ThemeSwitch } from './component/partial/theme-switch';
import { mainId } from './component/partial/delete-dialog';

const navSectionClasses = 'px-2.5 pb-1.5 text-xs font-semibold tracking-[.06em] text-fg-muted uppercase';

const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center justify-between rounded-lg px-2.5 py-[9px] no-underline ${
    isActive
      ? 'bg-nav-active text-link-hover hover:text-link-hover font-semibold forced-colors:outline forced-colors:outline-1'
      : 'text-fg-secondary hover:bg-surface-hover hover:text-fg'
  }`;

const App: FC = () => {
  const oidc = useOidc();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPathname = useRef<string>(pathname);

  const petCountQuery = usePetCountQuery(oidc.isAuthenticated);

  // after navigating to another page move the focus to the content, so screen readers continue there
  // (only the path: paging, sorting and filtering change the query and keep the focus where it is)
  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    // oxlint-disable-next-line functional/immutable-data
    previousPathname.current = pathname;
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <PageErrorProvider>
      <div className="flex min-h-full flex-wrap items-stretch">
        <a
          href={`#${mainId}`}
          className="bg-primary text-on-primary rounded-control sr-only font-semibold no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5"
          onClick={(e) => {
            e.preventDefault();
            mainRef.current?.focus();
          }}
        >
          Skip to content
        </a>
        <header className="border-line bg-sidebar basis-sidebar flex max-w-full grow flex-col gap-7 border-r px-3.5 py-5">
          <Link to="/" className="text-fg hover:text-fg flex items-center gap-2.5 px-2 no-underline">
            <span className="bg-primary text-on-primary flex size-8 items-center justify-center rounded-lg">
              <PawIcon size={18} />
            </span>
            <span className="flex flex-col">
              <strong className="text-[17px]">Petstore</strong>
              <span className="text-fg-muted text-[13px]">Admin</span>
            </span>
          </Link>
          <nav aria-label="Main" className="flex flex-col gap-0.5">
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              <li>
                <NavLink data-testid="navigation-home" to="/" end className={navLinkClasses}>
                  Home
                </NavLink>
              </li>
            </ul>
            <h2 className={`m-0 ${navSectionClasses} pt-[18px]`}>Resources</h2>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              <li>
                <NavLink
                  data-testid="navigation-pet"
                  to="/pet"
                  aria-label={petCountQuery.data ? `Pets (${petCountQuery.data.count} total)` : undefined}
                  className={navLinkClasses}
                >
                  <span>Pets</span>
                  {petCountQuery.data ? (
                    <span data-testid="navigation-pet-count" className="text-[13px] font-medium">
                      {petCountQuery.data.count}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            {oidc.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <strong data-testid="navigation-username" className="min-w-0 flex-1 truncate px-1 text-sm">
                  <span className="sr-only">Signed in as </span>
                  {oidc.username ?? 'unknown'}
                </strong>
                <Button data-testid="navigation-logout" variant="secondary" size="sm" onClick={oidc.logout}>
                  <LogOutIcon />
                  Log out
                </Button>
              </div>
            ) : null}
            <ThemeSwitch />
          </div>
        </header>
        {/* focus target of the skip link and after navigating, not interactive itself: no focus ring */}
        <main
          id={mainId}
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 flex-[999_1_560px] px-8 pt-7 pb-12 outline-none"
        >
          {/* caps the line length on wide screens, centered in the space next to the sidebar */}
          <div data-testid="content" className="max-w-content mx-auto flex w-full flex-col gap-[22px]">
            {/* one error at a time: authentication failed, otherwise the one of the page */}
            <PageError
              httpError={
                oidc.error ? new HttpError({ title: 'Authentication failed', detail: oidc.error.message }) : undefined
              }
            />
            {oidc.isLoading ? null : oidc.isAuthenticated ? (
              <Routes />
            ) : (
              <Card data-testid="login-required" aria-labelledby="login-title" className="max-w-md">
                <CardBody>
                  <H1 id="login-title">Sign in</H1>
                  <p className="text-fg-muted m-0">You need to sign in to manage the petstore.</p>
                  <div>
                    <Button data-testid="login" variant="primary" onClick={oidc.login}>
                      Sign in
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PageErrorProvider>
  );
};

export default App;
