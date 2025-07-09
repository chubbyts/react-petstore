import { describe, expect, test } from 'vitest';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import {
  provideCreateMutationFn,
  provideDeleteMutationFn,
  provideListQueryFn,
  provideReadQueryFn,
  provideUpdateMutationFn,
} from '../../src/hook/use-query';
import type { CreateClient, DeleteClient, ListClient, ReadClient, UpdateClient } from '../../src/client/client';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../../src/model/model';
import { HttpError } from '../../src/client/error';

describe('use-query', () => {
  describe('provideListQueryFn', () => {
    test('error', async () => {
      const modelListRequest: ModelListRequest = {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
      };

      const httpError = new HttpError({ title: 'title' });

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [modelListRequest], error: httpError as unknown as Error },
      ]);

      const listQueryFn = provideListQueryFn(listClient, modelListRequest);

      try {
        await listQueryFn();
        throw new Error('expected fail');
      } catch (e) {
        expect(e).toBe(httpError);
      }

      expect(listClientMocks.length).toBe(0);
    });

    test('successful', async () => {
      const modelListRequest: ModelListRequest = {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
      };

      const modelListResponse: ModelListResponse = {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 0,
        items: [],
        _links: {},
      };

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [modelListRequest], return: Promise.resolve(modelListResponse) },
      ]);

      const listQueryFn = provideListQueryFn(listClient, modelListRequest);

      expect(await listQueryFn()).toBe(modelListResponse);

      expect(listClientMocks.length).toBe(0);
    });
  });

  describe('provideCreateMutationFn', () => {
    test('error', async () => {
      const modelRequest: ModelRequest = {};

      const httpError = new HttpError({ title: 'title' });

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [modelRequest], error: httpError as unknown as Error },
      ]);

      const createQueryFn = provideCreateMutationFn(createClient);

      try {
        await createQueryFn(modelRequest);
        throw new Error('expected fail');
      } catch (e) {
        expect(e).toBe(httpError);
      }

      expect(createClientMocks.length).toBe(0);
    });

    test('successful', async () => {
      const modelRequest: ModelRequest = {};

      const modelResponse: ModelResponse = {
        id: 'id',
        createdAt: '2025-06-24T20:15:33.123Z',
        _links: {},
      };

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [modelRequest], return: Promise.resolve(modelResponse) },
      ]);

      const createQueryFn = provideCreateMutationFn(createClient);

      expect(await createQueryFn(modelRequest)).toBe(modelResponse);

      expect(createClientMocks.length).toBe(0);
    });
  });

  describe('provideReadQueryFn', () => {
    test('error', async () => {
      const httpError = new HttpError({ title: 'title' });

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['id'], error: httpError as unknown as Error },
      ]);

      const readQueryFn = provideReadQueryFn(readClient, 'id');

      try {
        await readQueryFn();
        throw new Error('expected fail');
      } catch (e) {
        expect(e).toBe(httpError);
      }

      expect(readClientMocks.length).toBe(0);
    });

    test('successful', async () => {
      const modelResponse: ModelResponse = {
        id: 'id',
        createdAt: '2025-06-24T20:15:33.123Z',
        _links: {},
      };

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['id'], return: Promise.resolve(modelResponse) },
      ]);

      const readQueryFn = provideReadQueryFn(readClient, 'id');

      expect(await readQueryFn()).toBe(modelResponse);

      expect(readClientMocks.length).toBe(0);
    });
  });

  describe('provideUpdateMutationFn', () => {
    test('error', async () => {
      const modelRequest: ModelRequest = {};

      const httpError = new HttpError({ title: 'title' });

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['id', modelRequest], error: httpError as unknown as Error },
      ]);

      const updateQueryFn = provideUpdateMutationFn(updateClient);

      try {
        await updateQueryFn(['id', modelRequest]);
        throw new Error('expected fail');
      } catch (e) {
        expect(e).toBe(httpError);
      }

      expect(updateClientMocks.length).toBe(0);
    });

    test('successful', async () => {
      const modelRequest: ModelRequest = {};

      const modelResponse: ModelResponse = {
        id: 'id',
        createdAt: '2025-06-24T20:15:33.123Z',
        _links: {},
      };

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['id', modelRequest], return: Promise.resolve(modelResponse) },
      ]);

      const updateQueryFn = provideUpdateMutationFn(updateClient);

      expect(await updateQueryFn(['id', modelRequest])).toBe(modelResponse);

      expect(updateClientMocks.length).toBe(0);
    });
  });

  describe('provideDeleteMutationFn', () => {
    test('error', async () => {
      const httpError = new HttpError({ title: 'title' });

      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['id'], error: httpError as unknown as Error },
      ]);

      const deleteQueryFn = provideDeleteMutationFn(deleteClient);

      try {
        await deleteQueryFn('id');
        throw new Error('expected fail');
      } catch (e) {
        expect(e).toBe(httpError);
      }

      expect(deleteClientMocks.length).toBe(0);
    });

    test('successful', async () => {
      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['id'], return: Promise.resolve(undefined) },
      ]);

      const deleteQueryFn = provideDeleteMutationFn(deleteClient);

      await deleteQueryFn('id');

      expect(deleteClientMocks.length).toBe(0);
    });
  });
});
