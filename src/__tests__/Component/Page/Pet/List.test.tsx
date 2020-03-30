import React from 'react';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import BadRequest from '../../../../Model/Error/BadRequest';
import HttpError from '../../../../Model/Error/HttpError';
import List from '../../../../Component/Page/Pet/List';
import NotFound from '../../../../Model/Error/NotFound';
import PetFilterFormProps from '../../../../Component/Form/PetFilterFormProps';
import PetList from '../../../../Model/Pet/PetList';
import Embedded from '../../../../Model/Pet/Embedded';
import PetResponse from '../../../../Model/Pet/PetResponse';
import Vaccination from '../../../../Model/Pet/Vaccination';
import Link from '../../../../Model/Link';

jest.mock('../../../../ApiClient/Pet');

jest.mock('../../../../Component/Form/PetFilterForm', () => {
    return ({ submitPetFilter }: PetFilterFormProps) => {
        const submit = async () => {
            await submitPetFilter({ name: 'Bro' });
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

    const { container, findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await findByTestId('page-pet-list');

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
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { container, findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await findByTestId('page-pet-list');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
                <div class="row"><a class="ui button green" role="button" href="/pet/create">Create</a></div>
                <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
                <div class="row">
                    <table class="ui single line striped selectable table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Name (<a data-testid="sort-pet-name-asc" href="/pet?sort%5Bname%5D=asc"> A-Z </a> |<a data-testid="sort-pet-name-desc" href="/pet?sort%5Bname%5D=desc"> Z-A </a> |<a data-testid="sort-pet-name--" href="/pet"> --- </a>)</th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                                <td>15.08.2005 - 17:52:01</td>
                                <td>15.08.2005 - 17:55:01</td>
                                <td>Brownie</td>
                                <td>0001-000</td>
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
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" type="pageItem" class="item">2</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('no actions', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {}
                })
            ]
        }),
        "_links": {}
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { container, findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await findByTestId('page-pet-list');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
                <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
                <div class="row">
                    <table class="ui single line striped selectable table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Name (<a data-testid="sort-pet-name-asc" href="/pet?sort%5Bname%5D=asc"> A-Z </a> |<a data-testid="sort-pet-name-desc" href="/pet?sort%5Bname%5D=desc"> Z-A </a> |<a data-testid="sort-pet-name--" href="/pet"> --- </a>)</th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                                <td>15.08.2005 - 17:52:01</td>
                                <td>15.08.2005 - 17:55:01</td>
                                <td>Brownie</td>
                                <td>0001-000</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <div aria-label="Pagination Navigation" role="navigation" class="ui pagination menu">
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="First item" type="firstItem" class="item">«</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Previous item" type="prevItem" class="item">⟨</a>
                        <a aria-current="true" aria-disabled="false" tabindex="0" value="1" type="pageItem" class="active item">1</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" type="pageItem" class="item">2</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('submit bad request', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    ApiClientPet.ListPets.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new BadRequest({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const { container, findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row">httpError: title</div>
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
                <div class="row"><a class="ui button green" role="button" href="/pet/create">Create</a></div>
                <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
                <div class="row">
                    <table class="ui single line striped selectable table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Name (<a data-testid="sort-pet-name-asc" href="/pet?filters%5Bname%5D=Bro&amp;sort%5Bname%5D=asc"> A-Z </a> |<a data-testid="sort-pet-name-desc" href="/pet?filters%5Bname%5D=Bro&amp;sort%5Bname%5D=desc"> Z-A </a> |<a data-testid="sort-pet-name--" href="/pet?filters%5Bname%5D=Bro"> --- </a>)</th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                                <td>15.08.2005 - 17:52:01</td>
                                <td>15.08.2005 - 17:55:01</td>
                                <td>Brownie</td>
                                <td>0001-000</td>
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
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" type="pageItem" class="item">2</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('submit filter', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(history.location.pathname).toBe('/pet');
    expect(history.location.search).toBe('?filters%5Bname%5D=Bro');
});

test('next', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { findByText } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const nextButton = await findByText('»');

    fireEvent.click(nextButton);

    await findByText('»');

    expect(history.location.pathname).toBe('/pet');
    expect(history.location.search).toBe('?page=2');
});

test('sort', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    const history = createMemoryHistory();

    const { findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const sortNameDescLink = await findByTestId('sort-pet-name-desc');

    fireEvent.click(sortNameDescLink);

    await findByTestId('sort-pet-name-desc');

    expect(history.location.pathname).toBe('/pet');
    expect(history.location.search).toBe('?sort%5Bname%5D=desc');
});

test('delete not found', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    ApiClientPet.DeletePet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new NotFound({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const { container, findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    const removePetButton = await findByTestId('remove-pet-0');

    fireEvent.click(removePetButton);

    await findByTestId('remove-pet-0');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row">httpError: title</div>
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
                <div class="row"><a class="ui button green" role="button" href="/pet/create">Create</a></div>
                <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
                <div class="row">
                    <table class="ui single line striped selectable table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Name (<a data-testid="sort-pet-name-asc" href="/pet?sort%5Bname%5D=asc"> A-Z </a> |<a data-testid="sort-pet-name-desc" href="/pet?sort%5Bname%5D=desc"> Z-A </a> |<a data-testid="sort-pet-name--" href="/pet"> --- </a>)</th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                                <td>15.08.2005 - 17:52:01</td>
                                <td>15.08.2005 - 17:55:01</td>
                                <td>Brownie</td>
                                <td>0001-000</td>
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
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" type="pageItem" class="item">2</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('delete success', async () => {
    const petList = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
                new PetResponse({
                    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
                    createdAt: '2005-08-15T15:52:01+00:00',
                    updatedAt: '2005-08-15T15:55:01+00:00',
                    name: 'Brownie',
                    tag: '0001-000',
                    vaccinations: [
                        new Vaccination({ name: 'Rabies' })
                    ],
                    _links: {
                        "read": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "GET"
                            }
                        }),
                        "update": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "PUT"
                            }
                        }),
                        "delete": new Link({
                            "href": "/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9",
                            "templated": false,
                            "rel": [],
                            "attributes": {
                                "method": "DELETE"
                            }
                        })
                    }
                })
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    const petListNoItem = new PetList({
        offset: 0,
        limit: 1,
        count: 2,
        _embedded: new Embedded({
            items: [
            ]
        }),
        "_links": {
            "create": new Link({
                "href": "/api/pets",
                "templated": false,
                "rel": [],
                "attributes": {
                    "method": "POST"
                }
            })
        }
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petList));
    });

    ApiClientPet.DeletePet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve());
    });

    ApiClientPet.ListPets.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(petListNoItem));
    });

    const history = createMemoryHistory();

    const { container, findByTestId } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    const removePetButton = await findByTestId('remove-pet-0');

    fireEvent.click(removePetButton);

    await findByTestId('remove-pet-0');

    expect(container.outerHTML).toBe(`
        <div>
            <main class="ui padded grid" data-testid="page-pet-list">
                <div class="row"><h1 class="ui huge dividing header">List Pets</h1></div>
                <div class="row"><a class="ui button green" role="button" href="/pet/create">Create</a></div>
                <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
                <div class="row">
                    <table class="ui single line striped selectable table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Name (<a data-testid="sort-pet-name-asc" href="/pet?sort%5Bname%5D=asc"> A-Z </a> |<a data-testid="sort-pet-name-desc" href="/pet?sort%5Bname%5D=desc"> Z-A </a> |<a data-testid="sort-pet-name--" href="/pet"> --- </a>)</th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div aria-label="Pagination Navigation" role="navigation" class="ui pagination menu">
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="First item" type="firstItem" class="item">«</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="1" aria-label="Previous item" type="prevItem" class="item">⟨</a>
                        <a aria-current="true" aria-disabled="false" tabindex="0" value="1" type="pageItem" class="active item">1</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" type="pageItem" class="item">2</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Next item" type="nextItem" class="item">⟩</a>
                        <a aria-current="false" aria-disabled="false" tabindex="0" value="2" aria-label="Last item" type="lastItem" class="item">»</a>
                    </div>
                </div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});
