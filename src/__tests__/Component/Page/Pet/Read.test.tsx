import React from 'react';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import HttpError from '../../../../Model/Error/HttpError';
import NotFound from '../../../../Model/Error/NotFound';
import PetResponse from '../../../../Model/Pet/PetResponse';
import Read from '../../../../Component/Page/Pet/Read';
import Vaccination from '../../../../Model/Pet/Vaccination';

jest.mock('../../../../ApiClient/Pet');

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

    const { container, findByTestId } = render(
        <Router history={history}>
            <Read match={match} />
        </Router>
    );

    await findByTestId('page-pet-read');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-read">
                <div class="row">httpError: title</div>
                <div class="row"><h1 class="ui huge dividing header">Read Pet</h1></div>
                <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('minimal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie'
    });

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Read match={match} />
        </Router>
    );

    await findByTestId('page-pet-read');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-read">
                <div class="row"><h1 class="ui huge dividing header">Read Pet</h1></div>
                <div class="row">
                    <div role="list" class="ui list">
                        <div role="listitem" class="item">
                            <div class="header">Id</div>
                            4d783b77-eb09-4603-b99b-f590b605eaa9
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">CreatedAt</div>
                            15.08.2005 - 17:52:01
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">UpdatedAt</div>
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">Name</div>
                            Brownie
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">Tag</div>
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">Vaccinations</div>
                        </div>
                    </div>
                </div>
                <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('maximal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        tag: '0001-000',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Read match={match} />
        </Router>
    );

    await findByTestId('page-pet-read');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-read">
                <div class="row"><h1 class="ui huge dividing header">Read Pet</h1></div>
                <div class="row">
                    <div role="list" class="ui list">
                        <div role="listitem" class="item">
                            <div class="header">Id</div>
                            4d783b77-eb09-4603-b99b-f590b605eaa9
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">CreatedAt</div>
                            15.08.2005 - 17:52:01
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">UpdatedAt</div>
                            15.08.2005 - 17:55:01
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">Name</div>
                            Brownie
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">Tag</div>
                            0001-000
                        </div>
                        <div role="listitem" class="item">
                            <div class="header">Vaccinations</div>
                            <ul>
                                <li>Rabies</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});
