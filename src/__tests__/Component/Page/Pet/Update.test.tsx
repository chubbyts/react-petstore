import React from 'react';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import HttpError from '../../../../Model/Error/HttpError';
import NotFound from '../../../../Model/Error/NotFound';
import PetFormProps from '../../../../Component/Form/PetFormProps';
import PetRequest from '../../../../Model/Pet/PetRequest';
import PetResponse from '../../../../Model/Pet/PetResponse';
import UnprocessableEntity from '../../../../Model/Error/UnprocessableEntity';
import Update from '../../../../Component/Page/Pet/Update';
import Vaccination from '../../../../Model/Pet/Vaccination';

let mockReadPet = (id: string) => { };
let mockUpdatePet = (id: string, pet: PetRequest) => { };

jest.mock('../../../../ApiClient/Pet', () => {
    return {
        ReadPet: (id: string) => {
            return mockReadPet(id);
        },
        UpdatePet: (id: string, pet: PetRequest) => {
            return mockUpdatePet(id, pet);
        }
    };
});

jest.mock('../../../../Component/Form/PetForm', () => {
    return ({ submitPet }: PetFormProps) => {
        const onSubmit = () => {
            submitPet({ name: 'Brownie' });
        };

        return (<button data-testid="test-button" onClick={onSubmit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div>httpError: {httpError.title}</div>);
    };
});

test('not found', async () => {
    mockReadPet = async (id: string) => {
        return new Promise((resolve) => resolve(new NotFound({ title: 'title' })));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await findByTestId('page-pet-update');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-update">
                <div>httpError: title</div>
                <h1>Update Pet</h1>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('minimal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie'
    });

    mockReadPet = async (id: string) => {
        return new Promise((resolve) => resolve(pet));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await findByTestId('page-pet-update');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-update">
                <h1>Update Pet</h1>
                <button data-testid="test-button"></button>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('unprocessable entity', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    mockReadPet = async (id: string) => {
        return new Promise((resolve) => resolve(pet));
    };

    mockUpdatePet = async (id: string, pet: PetRequest) => {
        return new Promise((resolve) => resolve(new UnprocessableEntity({ title: 'title' })));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-update">
                <div>httpError: title</div>
                <h1>Update Pet</h1>
                <button data-testid="test-button"></button>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('successful', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    mockReadPet = async (id: string) => {
        return new Promise((resolve) => resolve(pet));
    };

    mockUpdatePet = async (id: string, pet: PetRequest) => {
        return new Promise((resolve) => resolve(pet));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(history.location.pathname).toBe('/pet');
});
