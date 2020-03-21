import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App';

jest.mock('../Component/Navigation/Left', () => {
    return () => {
        return (<div data-testid="navigation-left-mock"></div>);
    };
});

jest.mock('../Component/Navigation/Top', () => {
    return () => {
        return (<div data-testid="navigation-top-mock"></div>);
    };
});

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

test('home page', () => {
    const { container } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div data-testid="navigation-top-mock"></div>
                <div class="ui padded grid">
                    <div data-testid="navigation-left-mock"></div>
                    <div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('not found', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/unknown']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div data-testid="navigation-top-mock"></div>
                <div class="ui padded grid">
                    <div data-testid="navigation-left-mock"></div>
                    <div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content">
                        <div data-testid="page-not-found-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet list', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div data-testid="navigation-top-mock"></div>
                <div class="ui padded grid">
                    <div data-testid="navigation-left-mock"></div>
                    <div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content">
                        <div data-testid="page-pet-list-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet create', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/create']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div data-testid="navigation-top-mock"></div>
                <div class="ui padded grid">
                    <div data-testid="navigation-left-mock"></div>
                    <div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content">
                        <div data-testid="page-pet-create-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet read', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div data-testid="navigation-top-mock"></div>
                <div class="ui padded grid">
                    <div data-testid="navigation-left-mock"></div>
                    <div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content">
                        <div data-testid="page-pet-read-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet update', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div data-testid="navigation-top-mock"></div>
                <div class="ui padded grid">
                    <div data-testid="navigation-left-mock"></div>
                    <div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content">
                        <div data-testid="page-pet-update-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});
