import { ListPets, CreatePet, ReadPet, UpdatePet, DeletePet } from '../../ApiClient/Pet';
import BadRequest from '../../Type/Error/BadRequest';
import fetchMock from 'fetch-mock';
import InternalServerError from '../../Type/Error/InternalServerError';
import NotFound from '../../Type/Error/NotFound';
import UnprocessableEntity from '../../Type/Error/UnprocessableEntity';
import NetworkError from '../../Type/Error/NetworkError';

beforeEach(() => {
    fetchMock.restore();
});

describe('list pets', () => {
    test('success', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { offset: 0, limit: 20, count: 35, _embedded: { items: [] }, _links: { create: {} } }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        expect(response).toHaveProperty('offset');
        expect(response.offset).toEqual(0);

        expect(response).toHaveProperty('limit');
        expect(response.limit).toEqual(20);

        expect(response).toHaveProperty('count');
        expect(response.count).toEqual(35);
    });

    test('bad request', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Bad Request',
                    detail: 'Sorting value',
                    instance: '0123456789abcdef',
                    invalidParameters: [
                        { name: 'name', reason: 'unknown field', details: { key: 'value1' } }
                    ]
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        expect(response).toBeInstanceOf(BadRequest);

        expect(response.title).toEqual('Bad Request');
        expect(response.detail).toEqual('Sorting value');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('internal server error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        expect(response).toBeInstanceOf(InternalServerError);

        expect(response.title).toEqual('Internal Server Error');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('network error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        expect(response).toBeInstanceOf(NetworkError);

        expect(response.title).toEqual('Failed to fetch');
    });

    test('unknown response', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets?sort[name]=asc',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            await ListPets('sort[name]=asc');
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('create pet', () => {
    test('success', async () => {
        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { name: 'Black Beauty' }
            }
        );

        const pet = { name: 'Black Beauty' };

        const response = await CreatePet(pet);

        expect(response).toHaveProperty('id');
        expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
        expect(response).toHaveProperty('name');
        expect(response.name).toEqual('Black Beauty');
    });

    test('unprocessable entity', async () => {
        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 422,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Unprocessable Entity',
                    detail: 'name',
                    instance: '0123456789abcdef',
                    invalidParameters: [
                        { name: 'name', reason: 'empty', details: { key: 'value1' } }
                    ]
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { name: '' }
            }
        );

        const pet = { name: '' };

        const response = await CreatePet(pet);

        expect(response).toBeInstanceOf(UnprocessableEntity);

        expect(response.title).toEqual('Unprocessable Entity');
        expect(response.detail).toEqual('name');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('internal server error', async () => {
        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { name: 'Black Beauty' }
            }
        );

        const pet = { name: 'Black Beauty' };

        const response = await CreatePet(pet);

        expect(response).toBeInstanceOf(InternalServerError);

        expect(response.title).toEqual('Internal Server Error');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('network error', async () => {
        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const pet = { name: 'Black Beauty' };

        const response = await CreatePet(pet);

        expect(response).toBeInstanceOf(NetworkError);

        expect(response.title).toEqual('Failed to fetch');
    });

    test('unknown response', async () => {
        fetchMock.post(
            'https://petstore.test/api/pets',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            const pet = { name: 'Black Beauty' };

            await CreatePet(pet);
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('read pet', () => {
    test('success', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        expect(response).toHaveProperty('id');
        expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
        expect(response).toHaveProperty('name');
        expect(response.name).toEqual('Black Beauty');
    });

    test('not found', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Not Found',
                    detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        expect(response).toBeInstanceOf(NotFound);

        expect(response.title).toEqual('Not Found');
        expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('internal server error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        expect(response).toBeInstanceOf(InternalServerError);

        expect(response.title).toEqual('Internal Server Error');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('network error', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');

        expect(response).toBeInstanceOf(NetworkError);

        expect(response.title).toEqual('Failed to fetch');
    });

    test('unknown response', async () => {
        fetchMock.get(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9');
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('update pet', () => {
    test('success', async () => {
        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' };

        const response = await UpdatePet(pet);

        expect(response).toHaveProperty('id');
        expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
        expect(response).toHaveProperty('name');
        expect(response.name).toEqual('Black Beauty');
    });

    test('not found', async () => {
        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Not Found',
                    detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' };

        const response = await UpdatePet(pet);

        expect(response).toBeInstanceOf(NotFound);

        expect(response.title).toEqual('Not Found');
        expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('unprocessable entity', async () => {
        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 422,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Unprocessable Entity',
                    detail: 'name',
                    instance: '0123456789abcdef',
                    invalidParameters: [
                        { name: 'name', reason: 'empty', details: { key: 'value1' } }
                    ]
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: '' }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9', name: '' };

        const response = await UpdatePet(pet);

        expect(response).toBeInstanceOf(UnprocessableEntity);

        expect(response.title).toEqual('Unprocessable Entity');
        expect(response.detail).toEqual('name');
        expect(response.instance).toEqual('0123456789abcdef');
    });


    test('internal server error', async () => {
        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: { id: '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' };

        const response = await UpdatePet(pet);

        expect(response).toBeInstanceOf(InternalServerError);

        expect(response.title).toEqual('Internal Server Error');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('network error', async () => {
        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' };

        const response = await UpdatePet(pet);

        expect(response).toBeInstanceOf(NetworkError);

        expect(response.title).toEqual('Failed to fetch');
    });

    test('unknown response', async () => {
        fetchMock.put(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9', name: 'Black Beauty' };

            await UpdatePet(pet);
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});

describe('delete pet', () => {
    test('success', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 204
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9' };

        await DeletePet(pet);
    });

    test('not found', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Not Found',
                    detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9' };

        const response = await DeletePet(pet);

        expect(response).toBeInstanceOf(NotFound);

        expect(response.title).toEqual('Not Found');
        expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('internal server error', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    title: 'Internal Server Error',
                    instance: '0123456789abcdef'
                }
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9' };

        const response = await DeletePet(pet);

        expect(response).toBeInstanceOf(InternalServerError);

        expect(response.title).toEqual('Internal Server Error');
        expect(response.instance).toEqual('0123456789abcdef');
    });

    test('network error', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                throws: new TypeError('Failed to fetch')
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9' };

        const response = await DeletePet(pet);

        expect(response).toBeInstanceOf(NetworkError);

        expect(response.title).toEqual('Failed to fetch');
    });

    test('unknown response', async () => {
        fetchMock.delete(
            'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
            {
                status: 418,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            },
            {
                delay: 10,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        expect.assertions(1);

        try {
            const pet = { 'id': '4d783b77-eb09-4603-b99b-f590b605eaa9' };

            await DeletePet(pet);
        } catch (e) {
            expect(e).toEqual(new Error('Unknown response'));
        }
    });
});
