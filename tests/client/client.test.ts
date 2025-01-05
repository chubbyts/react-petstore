import { describe, expect, test } from 'vitest';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import { z } from 'zod';
import type { Fetch } from '../../src/client/client';
import {
  createCreateClient,
  createDeleteClient,
  createListClient,
  createReadClient,
  createUpdateClient,
} from '../../src/client/client';
import {
  modelRequestSchema,
  modelResponseSchema,
  modelListRequestSchema,
  modelListResponseSchema,
} from '../../src/model/model';

const dummyModelRequestSchema = z.object({
  ...modelRequestSchema.shape,
  name: z.string(),
});

type DummyModelRequest = z.infer<typeof dummyModelRequestSchema>;

const dummyModelResponseSchema = z.object({
  ...modelResponseSchema.shape,
  ...dummyModelRequestSchema.shape,
});

type DummyModelResponse = z.infer<typeof dummyModelResponseSchema>;

const dummyModelListRequestSchema = z.object({
  ...modelListRequestSchema.shape,
  filters: z
    .object({
      name: z.string().optional(),
    })
    .strict()
    .optional(),
});

type DummyModelListRequest = z.infer<typeof dummyModelListRequestSchema>;

const dummyModelListResponseSchema = z.object({
  ...modelListResponseSchema.shape,
  filters: z
    .object({
      name: z.string().optional(),
    })
    .strict()
    .optional(),
  items: z.array(dummyModelResponseSchema),
});

type DummyModelListResponse = z.infer<typeof dummyModelListResponseSchema>;

describe('createListClient', () => {
  test('success', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const dummyModelResponse: DummyModelResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      ...dummyModelRequest,
      _links: {},
    };

    const dummyModelListRequest: DummyModelListRequest = { filters: { name: 'Dummy' } };

    const dummyModelListResponse: DummyModelListResponse = {
      offset: 0,
      limit: 20,
      filters: {},
      sort: {},
      count: 1,
      items: [dummyModelResponse],
      ...dummyModelListRequest,
      _links: {},
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models?filters%5Bname%5D=Dummy',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 200,
          json: () => Promise.resolve(dummyModelListResponse),
        } as Response),
      },
    ]);

    const listClient = createListClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelListRequestSchema,
      dummyModelListResponseSchema,
    );

    expect(await listClient({ filters: { name: 'Dummy' } })).toEqual(dummyModelListResponse);

    expect(fetchMocks.length).toBe(0);
  });

  test('bad request', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models?filters%5Bname%5D=Dummy',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 400,
          json: () =>
            Promise.resolve({
              title: 'Bad Request',
              detail: 'Sorting value',
              instance: '0123456789abcdef',
              invalidParameters: [{ name: 'name', reason: 'unknown field', details: { key: 'value1' } }],
            }),
        } as Response),
      },
    ]);

    const listClient = createListClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelListRequestSchema,
      dummyModelListResponseSchema,
    );

    expect(await listClient({ filters: { name: 'Dummy' } })).toMatchInlineSnapshot(`
      BadRequest {
        "detail": "Sorting value",
        "instance": "0123456789abcdef",
        "invalidParameters": [
          {
            "details": {
              "key": "value1",
            },
            "name": "name",
            "reason": "unknown field",
          },
        ],
        "title": "Bad Request",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('internal server error', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models?filters%5Bname%5D=Dummy',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 500,
          json: () =>
            Promise.resolve({
              title: 'Internal Server Error',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const listClient = createListClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelListRequestSchema,
      dummyModelListResponseSchema,
    );

    expect(await listClient({ filters: { name: 'Dummy' } })).toMatchInlineSnapshot(`
      InternalServerError {
        "detail": undefined,
        "instance": "0123456789abcdef",
        "title": "Internal Server Error",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('network error', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models?filters%5Bname%5D=Dummy',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        error: new Error('Failed to fetch'),
      },
    ]);

    const listClient = createListClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelListRequestSchema,
      dummyModelListResponseSchema,
    );

    expect(await listClient({ filters: { name: 'Dummy' } })).toMatchInlineSnapshot(`
      NetworkError {
        "detail": undefined,
        "instance": undefined,
        "title": "Failed to fetch",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unknown response', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models?filters%5Bname%5D=Dummy',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 418,
          json: () => Promise.resolve({}),
        } as Response),
      },
    ]);

    const listClient = createListClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelListRequestSchema,
      dummyModelListResponseSchema,
    );

    try {
      await listClient({ filters: { name: 'Dummy' } });
      throw new Error('expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[Error: Unknown response]');
    }

    expect(fetchMocks.length).toBe(0);
  });
});

describe('createCreateClient', () => {
  test('success', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const dummyModelResponse: DummyModelResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      ...dummyModelRequest,
      _links: {},
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 201,
          json: () => Promise.resolve(dummyModelResponse),
        } as Response),
      },
    ]);

    const createClient = createCreateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await createClient(dummyModelRequest)).toEqual(dummyModelResponse);

    expect(fetchMocks.length).toBe(0);
  });

  test('bad request', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 400,
          json: () =>
            Promise.resolve({
              title: 'Bad Request',
              detail: 'name',
              instance: '0123456789abcdef',
              invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
            }),
        } as Response),
      },
    ]);

    const createClient = createCreateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await createClient(dummyModelRequest)).toMatchInlineSnapshot(`
      BadRequest {
        "detail": "name",
        "instance": "0123456789abcdef",
        "invalidParameters": [
          {
            "details": {
              "key": "value1",
            },
            "name": "name",
            "reason": "empty",
          },
        ],
        "title": "Bad Request",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unprocessable entity', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 422,
          json: () =>
            Promise.resolve({
              title: 'Unprocessable Entity',
              detail: 'name',
              instance: '0123456789abcdef',
              invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
            }),
        } as Response),
      },
    ]);

    const createClient = createCreateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await createClient(dummyModelRequest)).toMatchInlineSnapshot(`
      UnprocessableEntity {
        "detail": "name",
        "instance": "0123456789abcdef",
        "invalidParameters": [
          {
            "details": {
              "key": "value1",
            },
            "name": "name",
            "reason": "empty",
          },
        ],
        "title": "Unprocessable Entity",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('internal server error', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 500,
          json: () =>
            Promise.resolve({
              title: 'Internal Server Error',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const createClient = createCreateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await createClient(dummyModelRequest)).toMatchInlineSnapshot(`
      InternalServerError {
        "detail": undefined,
        "instance": "0123456789abcdef",
        "title": "Internal Server Error",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('network error', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        error: new Error('Failed to fetch'),
      },
    ]);

    const createClient = createCreateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await createClient(dummyModelRequest)).toMatchInlineSnapshot(`
      NetworkError {
        "detail": undefined,
        "instance": undefined,
        "title": "Failed to fetch",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unknown response', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 418,
          json: () => Promise.resolve({}),
        } as Response),
      },
    ]);

    const createClient = createCreateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    try {
      await createClient(dummyModelRequest);
      throw new Error('expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[Error: expect fail]');
    }

    expect(fetchMocks.length).toBe(0);
  });
});

describe('createReadClient', () => {
  test('success', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const dummyModelResponse: DummyModelResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      ...dummyModelRequest,
      _links: {},
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          `https://petstore.test/api/models/${dummyModelResponse.id}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 200,
          json: () => Promise.resolve(dummyModelResponse),
        } as Response),
      },
    ]);

    const readClient = createReadClient(fetch, 'https://petstore.test/api/models', dummyModelResponseSchema);

    expect(await readClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toEqual(dummyModelResponse);

    expect(fetchMocks.length).toBe(0);
  });

  test('not found', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 404,
          json: () =>
            Promise.resolve({
              title: 'Not Found',
              detail: 'There is no model with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const readClient = createReadClient(fetch, 'https://petstore.test/api/models', dummyModelResponseSchema);

    expect(await readClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toMatchInlineSnapshot(`
      NotFound {
        "detail": "There is no model with id "4d783b77-eb09-4603-b99b-f590b605eaa9"",
        "instance": "0123456789abcdef",
        "title": "Not Found",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('internal server error', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 500,
          json: () =>
            Promise.resolve({
              title: 'Internal Server Error',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const readClient = createReadClient(fetch, 'https://petstore.test/api/models', dummyModelResponseSchema);

    expect(await readClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toMatchInlineSnapshot(`
      InternalServerError {
        "detail": undefined,
        "instance": "0123456789abcdef",
        "title": "Internal Server Error",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('network error', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        error: new Error('Failed to fetch'),
      },
    ]);

    const readClient = createReadClient(fetch, 'https://petstore.test/api/models', dummyModelResponseSchema);

    expect(await readClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toMatchInlineSnapshot(`
      NetworkError {
        "detail": undefined,
        "instance": undefined,
        "title": "Failed to fetch",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unknown response', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 418,
          json: () => Promise.resolve({}),
        } as Response),
      },
    ]);

    const readClient = createReadClient(fetch, 'https://petstore.test/api/models', dummyModelResponseSchema);

    try {
      await readClient('4d783b77-eb09-4603-b99b-f590b605eaa9');
      throw new Error('expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[Error: expect fail]');
    }

    expect(fetchMocks.length).toBe(0);
  });
});

describe('createUpdateClient', () => {
  test('success', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const dummyModelResponse: DummyModelResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      ...dummyModelRequest,
      _links: {},
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          `https://petstore.test/api/models/${dummyModelResponse.id}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 200,
          json: () => Promise.resolve(dummyModelResponse),
        } as Response),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest)).toEqual(dummyModelResponse);

    expect(fetchMocks.length).toBe(0);
  });

  test('bad request', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 400,
          json: () =>
            Promise.resolve({
              title: 'Bad Request',
              detail: 'name',
              instance: '0123456789abcdef',
              invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
            }),
        } as Response),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest)).toMatchInlineSnapshot(`
      BadRequest {
        "detail": "name",
        "instance": "0123456789abcdef",
        "invalidParameters": [
          {
            "details": {
              "key": "value1",
            },
            "name": "name",
            "reason": "empty",
          },
        ],
        "title": "Bad Request",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('not found', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 404,
          json: () =>
            Promise.resolve({
              title: 'Not Found',
              detail: 'There is no model with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest)).toMatchInlineSnapshot(`
      NotFound {
        "detail": "There is no model with id "4d783b77-eb09-4603-b99b-f590b605eaa9"",
        "instance": "0123456789abcdef",
        "title": "Not Found",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unprocessable entity', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 422,
          json: () =>
            Promise.resolve({
              title: 'Unprocessable Entity',
              detail: 'name',
              instance: '0123456789abcdef',
              invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
            }),
        } as Response),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest)).toMatchInlineSnapshot(`
      UnprocessableEntity {
        "detail": "name",
        "instance": "0123456789abcdef",
        "invalidParameters": [
          {
            "details": {
              "key": "value1",
            },
            "name": "name",
            "reason": "empty",
          },
        ],
        "title": "Unprocessable Entity",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('internal server error', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 500,
          json: () =>
            Promise.resolve({
              title: 'Internal Server Error',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest)).toMatchInlineSnapshot(`
      InternalServerError {
        "detail": undefined,
        "instance": "0123456789abcdef",
        "title": "Internal Server Error",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('network error', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        error: new Error('Failed to fetch'),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    expect(await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest)).toMatchInlineSnapshot(`
      NetworkError {
        "detail": undefined,
        "instance": undefined,
        "title": "Failed to fetch",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unknown response', async () => {
    const dummyModelRequest: DummyModelRequest = {
      name: 'Dummy',
    };

    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dummyModelRequest),
          },
        ],
        return: Promise.resolve({
          status: 418,
          json: () => Promise.resolve({}),
        } as Response),
      },
    ]);

    const updateClient = createUpdateClient(
      fetch,
      'https://petstore.test/api/models',
      dummyModelRequestSchema,
      dummyModelResponseSchema,
    );

    try {
      await updateClient('4d783b77-eb09-4603-b99b-f590b605eaa9', dummyModelRequest);
      throw new Error('expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[Error: expect fail]');
    }

    expect(fetchMocks.length).toBe(0);
  });
});

describe('createDeleteClient', () => {
  test('success', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 204,
          json: () => Promise.resolve(undefined),
        } as Response),
      },
    ]);

    const deleteClient = createDeleteClient(fetch, 'https://petstore.test/api/models');

    expect(await deleteClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toBeUndefined();

    expect(fetchMocks.length).toBe(0);
  });

  test('not found', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 404,
          json: () =>
            Promise.resolve({
              title: 'Not Found',
              detail: 'There is no model with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const deleteClient = createDeleteClient(fetch, 'https://petstore.test/api/models');

    expect(await deleteClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toMatchInlineSnapshot(`
      NotFound {
        "detail": "There is no model with id "4d783b77-eb09-4603-b99b-f590b605eaa9"",
        "instance": "0123456789abcdef",
        "title": "Not Found",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('internal server error', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 500,
          json: () =>
            Promise.resolve({
              title: 'Internal Server Error',
              instance: '0123456789abcdef',
            }),
        } as Response),
      },
    ]);

    const deleteClient = createDeleteClient(fetch, 'https://petstore.test/api/models');

    expect(await deleteClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toMatchInlineSnapshot(`
      InternalServerError {
        "detail": undefined,
        "instance": "0123456789abcdef",
        "title": "Internal Server Error",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('network error', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        error: new Error('Failed to fetch'),
      },
    ]);

    const deleteClient = createDeleteClient(fetch, 'https://petstore.test/api/models');

    expect(await deleteClient('4d783b77-eb09-4603-b99b-f590b605eaa9')).toMatchInlineSnapshot(`
      NetworkError {
        "detail": undefined,
        "instance": undefined,
        "title": "Failed to fetch",
      }
    `);

    expect(fetchMocks.length).toBe(0);
  });

  test('unknown response', async () => {
    const [fetch, fetchMocks] = useFunctionMock<Fetch>([
      {
        parameters: [
          'https://petstore.test/api/models/4d783b77-eb09-4603-b99b-f590b605eaa9',
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          },
        ],
        return: Promise.resolve({
          status: 418,
          json: () => Promise.resolve({}),
        } as Response),
      },
    ]);

    const deleteClient = createDeleteClient(fetch, 'https://petstore.test/api/models');

    try {
      await deleteClient('4d783b77-eb09-4603-b99b-f590b605eaa9');
      throw new Error('expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[Error: expect fail]');
    }

    expect(fetchMocks.length).toBe(0);
  });
});
