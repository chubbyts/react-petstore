import { describe, expect, test } from 'vitest';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import { renderHook, act } from '@testing-library/react';
import { useModelResource } from '../../src/hook/use-model-resource';
import type { CreateClient, ReadClient, DeleteClient, ListClient, UpdateClient } from '../../src/client/client';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../../src/model/model';
import { BadRequest } from '../../src/client/error';

describe('useModelResource', () => {
  describe('list', () => {
    test('missing client', async () => {
      const { result } = renderHook(() => useModelResource({}));

      try {
        await result.current.actions.listModel({});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing listClient]');
      }
    });

    test('error', async () => {
      const clientHttpError = new BadRequest({ title: 'bad request' });

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [{}], return: Promise.resolve(clientHttpError) },
      ]);

      const { result } = renderHook(() => useModelResource({ listClient }));

      expect(result.current.modelList).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.listModel({})).toBe(false);
      });

      expect(result.current.modelList).toBeUndefined();
      expect(result.current.httpError).toBe(clientHttpError);

      expect(listClientMocks.length).toBe(0);
    });

    test('success', async () => {
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
        { parameters: [{}], return: Promise.resolve(modelListResponse) },
      ]);

      const { result } = renderHook(() => useModelResource({ listClient }));

      expect(result.current.modelList).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.listModel({})).toBe(true);
      });

      expect(result.current.modelList).toBe(modelListResponse);
      expect(result.current.httpError).toBeUndefined();

      expect(listClientMocks.length).toBe(0);
    });
  });

  describe('create', () => {
    test('missing client', async () => {
      const { result } = renderHook(() => useModelResource({}));

      try {
        await result.current.actions.createModel({});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing createClient]');
      }
    });

    test('error', async () => {
      const clientHttpError = new BadRequest({ title: 'bad request' });

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [{}], return: Promise.resolve(clientHttpError) },
      ]);

      const { result } = renderHook(() => useModelResource({ createClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.createModel({})).toBe(false);
      });

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBe(clientHttpError);

      expect(createClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [{}], return: Promise.resolve(modelResponse) },
      ]);

      const { result } = renderHook(() => useModelResource({ createClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.createModel({})).toBe(true);
      });

      expect(result.current.model).toBe(modelResponse);
      expect(result.current.httpError).toBeUndefined();

      expect(createClientMocks.length).toBe(0);
    });
  });

  describe('read', () => {
    test('missing client', async () => {
      const { result } = renderHook(() => useModelResource({}));

      try {
        await result.current.actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719');
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing readClient]');
      }
    });

    test('error', async () => {
      const clientHttpError = new BadRequest({ title: 'bad request' });

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(clientHttpError) },
      ]);

      const { result } = renderHook(() => useModelResource({ readClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(false);
      });

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBe(clientHttpError);

      expect(readClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(modelResponse) },
      ]);

      const { result } = renderHook(() => useModelResource({ readClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(true);
      });

      expect(result.current.model).toBe(modelResponse);
      expect(result.current.httpError).toBeUndefined();

      expect(readClientMocks.length).toBe(0);
    });
  });

  describe('update', () => {
    test('missing client', async () => {
      const { result } = renderHook(() => useModelResource({}));

      try {
        await result.current.actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing updateClient]');
      }
    });

    test('error', async () => {
      const clientHttpError = new BadRequest({ title: 'bad request' });

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719', {}], return: Promise.resolve(clientHttpError) },
      ]);

      const { result } = renderHook(() => useModelResource({ updateClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {})).toBe(false);
      });

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBe(clientHttpError);

      expect(updateClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719', {}], return: Promise.resolve(modelResponse) },
      ]);

      const { result } = renderHook(() => useModelResource({ updateClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {})).toBe(true);
      });

      expect(result.current.model).toBe(modelResponse);
      expect(result.current.httpError).toBeUndefined();

      expect(updateClientMocks.length).toBe(0);
    });
  });

  describe('delete', () => {
    test('missing client', async () => {
      const { result } = renderHook(() => useModelResource({}));

      try {
        await result.current.actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719');
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing deleteClient]');
      }
    });

    test('error', async () => {
      const clientHttpError = new BadRequest({ title: 'bad request' });

      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(clientHttpError) },
      ]);

      const { result } = renderHook(() => useModelResource({ deleteClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(false);
      });

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBe(clientHttpError);

      expect(deleteClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(undefined) },
      ]);

      const { result } = renderHook(() => useModelResource({ deleteClient }));

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      await act(async () => {
        expect(await result.current.actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(true);
      });

      expect(result.current.model).toBeUndefined();
      expect(result.current.httpError).toBeUndefined();

      expect(deleteClientMocks.length).toBe(0);
    });
  });
});
