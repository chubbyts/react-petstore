import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import ReactRouterDom, { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

ReactRouterDom.BrowserRouter = ({children}) => <div>{children}</div>

jest.mock('../Component/Page/Home', () => {
    return () => {
        return (<div data-testid="page-home-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/List', () => {
    return () => {
        return (<div data-testid="page-pet-list-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/Create', () => {
    return () => {
        return (<div data-testid="page-pet-create-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/Read', () => {
    return () => {
        return (<div data-testid="page-pet-read-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/Update', () => {
    return () => {
        return (<div data-testid="page-pet-update-mock"></div>);
    };
});

jest.mock('../Component/Page/NotFound', () => {
    return () => {
        return (<div data-testid="page-not-found-mock"></div>);
    };
});

test('toggle', async () => {
    const { container } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    const navigationToggle = await screen.findByTestId('navigation-toggle');

    userEvent.click(navigationToggle);

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="displayMenu">
                    <nav id="top-nav" class="clearfix">
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
                                <a href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('home page', async () => {
    const { container } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    await screen.findByTestId('page-home-mock');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
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
                                <a href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('not found', async () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/unknown']}>
            <App />
        </MemoryRouter>
    );

    await screen.findByTestId('page-not-found-mock');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
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
                                <a href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-not-found-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('pet list', async () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <App />
        </MemoryRouter>
    );

    await screen.findByTestId('page-pet-list-mock');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
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
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('pet create', async () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/create']}>
            <App />
        </MemoryRouter>
    );

    await screen.findByTestId('page-pet-create-mock');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
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
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('pet read', async () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9']}>
            <App />
        </MemoryRouter>
    );

    await screen.findByTestId('page-pet-read-mock');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
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
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('pet update', async () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update']}>
            <App />
        </MemoryRouter>
    );

    await screen.findByTestId('page-pet-update-mock');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
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
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});
