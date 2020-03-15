import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitForElement } from '@testing-library/react';
import * as ApiClientPet from './ApiClient/Pet';
import App from './App';

jest.mock('./ApiClient/Pet');

test('navigations', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    expect(getByTestId('navigation-top')).toBeInTheDocument();
    expect(getByTestId('navigation-left')).toBeInTheDocument();
});

test('home page', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    const pageHome = await waitForElement(() =>
        getByTestId('page-home')
    );

    expect(pageHome).toBeInTheDocument();

    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});

test('not found', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/unknown']}>
            <App />
        </MemoryRouter>
    );

    const pageNotFound = await waitForElement(() =>
        getByTestId('page-not-found')
    );

    expect(pageNotFound).toBeInTheDocument();

    expect(queryByTestId('page-home')).toBeNull();
    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
});

test('pet list', async () => {
    ApiClientPet.ListPets.mockResolvedValueOnce(new Promise((resolve) => {
        resolve({ offset: 0, limit: 20, count: 0, _embedded: { items: [] }, _links: { create: {} } });
    }));

    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-list')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});

test('pet create', async () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet/create']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-create')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home')).toBeNull();
    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});

test('pet read', async () => {
    ApiClientPet.ReadPet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve({
            name: 'Black Beauty',
            createdAt: new Date(),
            vaccinations: []
        });
    }));

    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-read')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home')).toBeNull();
    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});

test('pet update', async () => {
    ApiClientPet.ReadPet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve({
            name: 'Black Beauty',
            createdAt: new Date(),
            vaccinations: []
        });
    }));

    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update']}>
            <App />
        </MemoryRouter>
    );

    const pagePetList = await waitForElement(() =>
        getByTestId('page-pet-update')
    );

    expect(pagePetList).toBeInTheDocument();

    expect(queryByTestId('page-home')).toBeNull();
    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});
