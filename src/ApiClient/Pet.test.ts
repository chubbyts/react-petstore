import { ListPets } from './Pet';
import BadRequest from '../Type/Error/BadRequest';
import fetchMock from 'fetch-mock';

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
                delay: 100,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        expect(response).toHaveProperty('offset');
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
                delay: 100,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const response = await ListPets('sort[name]=asc');

        expect(response).toBeInstanceOf(BadRequest);

        expect(response.title).toEqual('Bad Request');
        expect(response.detail).toEqual('Sorting value');
    });
});

