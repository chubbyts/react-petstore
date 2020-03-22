import React from 'react';
import { createMemoryHistory } from 'history';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import BadRequest from '../../../../Type/Error/BadRequest';
import HttpError from '../../../../Type/Error/HttpError';
import List from '../../../../Component/Page/Pet/List';
import PetFilterFormProps from '../../../../Type/Form/PetFilterFormProps';
import PetList from '../../../../Type/Pet/PetList';

jest.mock('../../../../ApiClient/Pet');

jest.mock('../../../../Component/Form/PetFilterForm', () => {
    return ({ submitPetFilter }: PetFilterFormProps) => {
        const submit = async () => {
            await submitPetFilter({ name: '' });
        };

        return (<button data-testid="test-button" onClick={submit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div className="row">httpError: {httpError.title}</div>);
    };
});

test('bad request', async () => {

    ApiClientPet.ListPets.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new BadRequest({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const { container, getByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-list')
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row">httpError: title</div>
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('default', async () => {
    const petList: PetList = {
        offset: 0,
        limit: 10,
        count: 1,
        _embedded: {
            items: [
                {
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    vaccinations: [
                        { name: 'Rabies' }
                    ],
                    _links: {
                        "read": {
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        },
                        "update": {
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        },
                        "delete": {
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        }
                    }
                }
            ]
        },
        "_links": {
            "create": {
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            }
        },
    };

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { container, getByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-list')
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
                <div class="row"><a class="ui button green" role="button" href="/pet/create">Create</a></div>
                <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
                <div class="row">
                    <div aria-label="Pagination Navigation" role="navigation" class="ui pagination menu">
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="First item" type="firstItem" class="item">«</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Previous item" type="prevItem" class="item">⟨</a>
                        <a aria-current="true" aria-disabled="false" tabindex="0" value="1" type="pageItem" class="active item">1</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                    <table class="ui single line striped selectable table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Name (<a href="/pet?sort%5Bname%5D=asc"> A-Z </a> |<a href="/pet?sort%5Bname%5D=desc"> Z-A </a> |<a href="/pet"> --- </a>)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                                <td>15.08.2005 - 17:52:01</td>
                                <td>15.08.2005 - 17:55:01</td>
                                <td>Brownie</td>
                                <td>
                                    <a class="ui button" role="button" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9">Read</a>
                                    <a class="ui button" role="button" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update">Update</a>
                                    <button data-testid="remove-pet-0" class="ui button red">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div aria-label="Pagination Navigation" role="navigation" class="ui pagination menu">
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="First item" type="firstItem" class="item">«</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Previous item" type="prevItem" class="item">⟨</a>
                        <a aria-current="true" aria-disabled="false" tabindex="0" value="1" type="pageItem" class="active item">1</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('submit filter', async () => {
    const petList: PetList = {
        offset: 0,
        limit: 10,
        count: 1,
        _embedded: {
            items: [
                {
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    vaccinations: [
                        { name: 'Rabies' }
                    ],
                    _links: {
                        "read": {
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        },
                        "update": {
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        },
                        "delete": {
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        }
                    }
                }
            ]
        },
        "_links": {
            "create": {
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            }
        },
    };

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { container, getByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await waitForElement(() =>
        getByTestId('page-pet-list')
    );

    fireEvent.click(getByTestId('test-button'));

    await waitForElement(() =>
        getByTestId('test-button')
    );

    expect(container.outerHTML).toBe(`
        <div><main class="ui padded grid"></main></div>
    `.replace(/\n {2,}/g, ''));

    expect(history.location.pathname).toBe('/pet');
});
