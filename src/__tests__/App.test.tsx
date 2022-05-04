import { render, screen } from '@testing-library/react';
import App from '../App';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { createMemoryHistory } from 'history';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        __esModule: true,
        ...originalModule,
        // add your noops here
        BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    };
});

jest.mock('../Component/Page/Home', () => {
    return () => {
        return <div data-testid="page-home-mock"></div>;
    };
});

jest.mock('../Component/Page/Pet/List', () => {
    return () => {
        return <div data-testid="page-pet-list-mock"></div>;
    };
});

jest.mock('../Component/Page/Pet/Create', () => {
    return () => {
        return <div data-testid="page-pet-create-mock"></div>;
    };
});

jest.mock('../Component/Page/Pet/Read', () => {
    return () => {
        return <div data-testid="page-pet-read-mock"></div>;
    };
});

jest.mock('../Component/Page/Pet/Update', () => {
    return () => {
        return <div data-testid="page-pet-update-mock"></div>;
    };
});

jest.mock('../Component/Page/NotFound', () => {
    return () => {
        return <div data-testid="page-not-found-mock"></div>;
    };
});

test('toggle', async () => {
    const history = createMemoryHistory();

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-home-mock');

    const navigationToggle = await screen.findByTestId('navigation-toggle');

    await userEvent.click(navigationToggle);

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="displayMenu">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a class="" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});

test('home page', async () => {
    const history = createMemoryHistory();

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-home-mock');

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a class="" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});

test('not found', async () => {
    const history = createMemoryHistory();
    history.push('/unknown');

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-not-found-mock');

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a class="" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a class="" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-not-found-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});

test('pet list', async () => {
    const history = createMemoryHistory();
    history.push('/pet');

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-pet-list-mock');

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a class="" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-list-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});

test('pet create', async () => {
    const history = createMemoryHistory();
    history.push('/pet/create');

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-pet-create-mock');

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a class="" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-create-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});

test('pet read', async () => {
    const history = createMemoryHistory();
    history.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-pet-read-mock');

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a class="" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-read-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});

test('pet update', async () => {
    const history = createMemoryHistory();
    history.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    const { container } = render(
        <HistoryRouter history={history}>
            <App />
        </HistoryRouter>,
    );

    await screen.findByTestId('page-pet-update-mock');

    expect(container.outerHTML).toBe(
        `
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="flow-root">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a class="" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-update-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `
            .replace(/\n/g, '')
            .replace(/ {2,}/g, ''),
    );
});
