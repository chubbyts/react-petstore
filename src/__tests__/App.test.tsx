import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitForElement } from '@testing-library/react';
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

test('navigations', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    expect(getByTestId('navigation-top-mock')).toBeInTheDocument();
    expect(getByTestId('navigation-left-mock')).toBeInTheDocument();
});

test('home page', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    const pageHome = await waitForElement(() =>
        getByTestId('page-home-mock')
    );

    expect(pageHome).toBeInTheDocument();

    expect(queryByTestId('page-pet-list-mock')).toBeNull();
    expect(queryByTestId('page-pet-create-mock')).toBeNull();
    expect(queryByTestId('page-pet-read-mock')).toBeNull();
    expect(queryByTestId('page-pet-update-mock')).toBeNull();
    expect(queryByTestId('page-not-found-mock')).toBeNull();
});

test('not found', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/unknown']}>
            <App />
        </MemoryRouter>
    );

    const pageNotFound = await waitForElement(() =>
        getByTestId('page-not-found-mock')
    );

    expect(pageNotFound).toBeInTheDocument();

    expect(queryByTestId('page-home-mock')).toBeNull();
    expect(queryByTestId('page-pet-list-mock')).toBeNull();
    expect(queryByTestId('page-pet-create-mock')).toBeNull();
    expect(queryByTestId('page-pet-read-mock')).toBeNull();
    expect(queryByTestId('page-pet-update-mock')).toBeNull();
});

test('pet list', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-list-mock')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home-mock')).toBeNull();
    expect(queryByTestId('page-pet-create-mock')).toBeNull();
    expect(queryByTestId('page-pet-read-mock')).toBeNull();
    expect(queryByTestId('page-pet-update-mock')).toBeNull();
    expect(queryByTestId('page-not-found-mock')).toBeNull();
});

test('pet create', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet/create']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-create-mock')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home-mock')).toBeNull();
    expect(queryByTestId('page-pet-list-mock')).toBeNull();
    expect(queryByTestId('page-pet-read-mock')).toBeNull();
    expect(queryByTestId('page-pet-update-mock')).toBeNull();
    expect(queryByTestId('page-not-found-mock')).toBeNull();
});

test('pet read', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-read-mock')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home-mock')).toBeNull();
    expect(queryByTestId('page-pet-list-mock')).toBeNull();
    expect(queryByTestId('page-pet-create-mock')).toBeNull();
    expect(queryByTestId('page-pet-update-mock')).toBeNull();
    expect(queryByTestId('page-not-found-mock')).toBeNull();
});

test('pet update', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-update-mock')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home-mock')).toBeNull();
    expect(queryByTestId('page-pet-list-mock')).toBeNull();
    expect(queryByTestId('page-pet-create-mock')).toBeNull();
    expect(queryByTestId('page-pet-read-mock')).toBeNull();
    expect(queryByTestId('page-not-found-mock')).toBeNull();
});
