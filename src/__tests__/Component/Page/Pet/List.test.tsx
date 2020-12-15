import React from 'react';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import BadRequest from '../../../../Model/Error/BadRequest';
import Embedded from '../../../../Model/Pet/Embedded';
import HttpError from '../../../../Model/Error/HttpError';
import Link from '../../../../Model/Link';
import List from '../../../../Component/Page/Pet/List';
import NotFound from '../../../../Model/Error/NotFound';
import PaginationProps from '../../../../Component/Partial/PaginationProps';
import PetFilterFormProps from '../../../../Component/Form/PetFilterFormProps';
import PetList from '../../../../Model/Pet/PetList';
import PetResponse from '../../../../Model/Pet/PetResponse';
import userEvent from '@testing-library/user-event';
import Vaccination from '../../../../Model/Pet/Vaccination';

let mockListPets = (queryString: string) => { };
let mockDeletePet = (id: string) => { };

jest.mock('../../../../ApiClient/Pet', () => {
    return {
        ListPets: (queryString: string) => {
            return mockListPets(queryString);
        },
        DeletePet: (id: string) => {
            return mockDeletePet(id);
        }
    };
});

beforeEach(() => {
    mockListPets = (queryString: string) => { };
    mockDeletePet = (id: string) => { };
});

jest.mock('../../../../Component/Form/PetFilterForm', () => {
    return ({ submitPetFilter }: PetFilterFormProps) => {
        const onSubmit = () => {
            submitPetFilter({ name: 'Bro' });
        };

        return (<button data-testid="test-filter-button" onClick={onSubmit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div>httpError: {httpError.title}</div>);
    };
});

jest.mock('../../../../Component/Partial/Pagination', () => {
    return ({ submitPage, currentPage, totalPages, maxPages }: PaginationProps) => {
        const submit = () => {
            submitPage(2);
        };

        return (
            <button
                data-testid="test-pagination-button"
                data-current-page={currentPage}
                data-total-pages={totalPages}
                data-max-pages={maxPages}
                onClick={submit}
            ></button>
        );
    };
});

test('bad request', async () => {
    mockListPets = async (queryString: string) => {
        return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'title' })));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await screen.findByTestId('page-pet-list');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-list">
                <div>httpError: title</div>
                <h1>List Pets</h1>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await screen.findByTestId('page-pet-list');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-list">
                <h1>List Pets</h1>
                <div>
                    <a class="btn-green mb-4" href="/pet/create">Create</a>
                    <button data-testid="test-filter-button"></button>
                    <table class="my-4">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>
                                    Name (
                                        <a data-testid="sort-pet-name-asc" href="/pet?page=1&amp;sort%5Bname%5D=asc"> A-Z </a> |
                                        <a data-testid="sort-pet-name-desc" href="/pet?page=1&amp;sort%5Bname%5D=desc"> Z-A </a> |
                                        <a data-testid="sort-pet-name--" href="/pet?page=1"> --- </a>
                                    )
                                </th>
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
                                    <a class="btn-gray mr-4" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9">Read</a>
                                    <a class="btn-gray mr-4" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update">Update</a>
                                    <button data-testid="remove-pet-0" class="btn-red">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button data-testid="test-pagination-button" data-current-page="1" data-total-pages="2" data-max-pages="7"></button>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    await screen.findByTestId('page-pet-list');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-list">
                <h1>List Pets</h1>
                <div>
                    <button data-testid="test-filter-button"></button>
                    <table class="my-4">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>
                                    Name (
                                        <a data-testid="sort-pet-name-asc" href="/pet?page=1&amp;sort%5Bname%5D=asc"> A-Z </a> |
                                        <a data-testid="sort-pet-name-desc" href="/pet?page=1&amp;sort%5Bname%5D=desc"> Z-A </a> |
                                        <a data-testid="sort-pet-name--" href="/pet?page=1"> --- </a>
                                    )
                                </th>
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
                    <button data-testid="test-pagination-button" data-current-page="1" data-total-pages="2" data-max-pages="7"></button>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    mockListPets = async (queryString: string) => {
        return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'title' })));
    };

    const testButton = await screen.findByTestId('test-filter-button');

    userEvent.click(testButton);

    await screen.findByTestId('test-filter-button');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-list">
                <div>httpError: title</div>
                <h1>List Pets</h1>
                <div>
                    <a class="btn-green mb-4" href="/pet/create">Create</a>
                    <button data-testid="test-filter-button"></button>
                    <table class="my-4">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>
                                    Name (
                                        <a data-testid="sort-pet-name-asc" href="/pet?page=1&amp;filters%5Bname%5D=Bro&amp;sort%5Bname%5D=asc"> A-Z </a> |
                                        <a data-testid="sort-pet-name-desc" href="/pet?page=1&amp;filters%5Bname%5D=Bro&amp;sort%5Bname%5D=desc"> Z-A </a> |
                                        <a data-testid="sort-pet-name--" href="/pet?page=1&amp;filters%5Bname%5D=Bro"> --- </a>
                                    )
                                </th>
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
                                    <a class="btn-gray mr-4" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9">Read</a>
                                    <a class="btn-gray mr-4" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update">Update</a>
                                    <button data-testid="remove-pet-0" class="btn-red">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button data-testid="test-pagination-button" data-current-page="1" data-total-pages="2" data-max-pages="7"></button>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    render(
        <Router history={history}>
            <List />
        </Router>
    );

    const testButton = await screen.findByTestId('test-filter-button');

    userEvent.click(testButton);

    await screen.findByTestId('test-filter-button');

    expect(history.location.pathname).toBe('/pet');
    expect(history.location.search).toBe('?page=1&filters%5Bname%5D=Bro');
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    render(
        <Router history={history}>
            <List />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const sortNameDescLink = await screen.findByTestId('sort-pet-name-desc');

    userEvent.click(sortNameDescLink);

    await screen.findByTestId('sort-pet-name-desc');

    expect(history.location.pathname).toBe('/pet');
    expect(history.location.search).toBe('?page=1&sort%5Bname%5D=desc');
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    render(
        <Router history={history}>
            <List />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const testButton = await screen.findByTestId('test-pagination-button');

    userEvent.click(testButton);

    await screen.findByTestId('test-pagination-button');

    expect(history.location.pathname).toBe('/pet');
    expect(history.location.search).toBe('?page=2');
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    mockDeletePet = async (id: string) => {
        return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
    };

    const removePetButton = await screen.findByTestId('remove-pet-0');

    userEvent.click(removePetButton);

    await screen.findByTestId('remove-pet-0');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-list">
                <div>httpError: title</div>
                <h1>List Pets</h1>
                <div>
                    <a class="btn-green mb-4" href="/pet/create">Create</a>
                    <button data-testid="test-filter-button"></button>
                    <table class="my-4">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>
                                    Name (
                                        <a data-testid="sort-pet-name-asc" href="/pet?page=1&amp;sort%5Bname%5D=asc"> A-Z </a> |
                                        <a data-testid="sort-pet-name-desc" href="/pet?page=1&amp;sort%5Bname%5D=desc"> Z-A </a> |
                                        <a data-testid="sort-pet-name--" href="/pet?page=1"> --- </a>
                                    )
                                </th>
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
                                    <a class="btn-gray mr-4" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9">Read</a>
                                    <a class="btn-gray mr-4" href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update">Update</a>
                                    <button data-testid="remove-pet-0" class="btn-red">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button data-testid="test-pagination-button" data-current-page="1" data-total-pages="2" data-max-pages="7"></button>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petList));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <List />
        </Router>
    );

    mockDeletePet = async (id: string) => {
        return new Promise((resolve) => resolve());
    };

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

    mockListPets = async (queryString: string) => {
        return new Promise<PetList>((resolve) => resolve(petListNoItem));
    };

    const removePetButton = await screen.findByTestId('remove-pet-0');

    userEvent.click(removePetButton);

    await screen.findByTestId('remove-pet-0');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-list">
                <h1>List Pets</h1>
                <div>
                    <a class="btn-green mb-4" href="/pet/create">Create</a>
                    <button data-testid="test-filter-button"></button>
                    <table class="my-4">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>
                                    Name (
                                        <a data-testid="sort-pet-name-asc" href="/pet?page=1&amp;sort%5Bname%5D=asc"> A-Z </a> |
                                        <a data-testid="sort-pet-name-desc" href="/pet?page=1&amp;sort%5Bname%5D=desc"> Z-A </a> |
                                        <a data-testid="sort-pet-name--" href="/pet?page=1"> --- </a>
                                    )
                                </th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button data-testid="test-pagination-button" data-current-page="1" data-total-pages="2" data-max-pages="7"></button>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});
