import React from 'react';
import { createMemoryHistory } from 'history';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import HttpError from '../../../../Type/Error/HttpError';
import NotFound from '../../../../Type/Error/NotFound';
import Pet from '../../../../Type/Pet/Pet';
import Read from '../../../../Component/Page/Pet/Read';
import Update from '../../../../Component/Page/Pet/Update';
import PetFormProps from '../../../../Type/Form/PetFormProps';
import UnprocessableEntity from '../../../../Type/Error/UnprocessableEntity';

jest.mock('../../../../ApiClient/Pet');

jest.mock('../../../../Component/Form/PetForm', () => {
    return ({ submitPet }: PetFormProps) => {
        const submit = async () => {
            await submitPet({ id: '', createdAt: '', name: '', vaccinations: [], _links: {} });
        };

        return (<button data-testid="test-button" onClick={submit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div className="row">httpError: {httpError.title}</div>);
    };
});

test('not found', async () => {
    ApiClientPet.ReadPet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new NotFound({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, getByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-update')
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-update">
                <div class="row">httpError: title</div>
                <div class="row"><h1 class="ui huge dividing header">Update Pet</h1></div>
                <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('minimal', async () => {
    const pet: Pet = {
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [],
        _links: {}
    };

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, getByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-update')
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-update">
                <div class="row"><h1 class="ui huge dividing header">Update Pet</h1></div>
                <div class="row">
                    <div class="ui attached segment"><button data-testid="test-button"></button></div>
                </div>
                <div class="row">
                    <a class="ui button" role="button" href="/pet">List</a>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('unprocessable entity', async () => {
    const pet: Pet = {
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [],
        _links: {}
    };

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    ApiClientPet.UpdatePet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new UnprocessableEntity({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, getByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-update')
    );

    fireEvent.click(getByTestId('test-button'));

    await waitForElement(() =>
        getByTestId('test-button')
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-update">
                <div class="row">httpError: title</div>
                <div class="row"><h1 class="ui huge dividing header">Update Pet</h1></div>
                <div class="row">
                    <div class="ui attached segment"><button data-testid="test-button"></button></div>
                </div>
                <div class="row">
                    <a class="ui button" role="button" href="/pet">List</a>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('successful', async () => {
    const pet: Pet = {
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [],
        _links: {}
    };

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    ApiClientPet.UpdatePet.mockImplementationOnce((pet: Pet) => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, getByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-update')
    );

    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByTestId('test-button'));

    await waitForElement(() =>
        getByTestId('test-button')
    );

    expect(history.location.pathname).toBe('/pet');
});
