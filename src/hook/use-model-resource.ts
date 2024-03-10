import { HttpError } from '../client/error';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../model/model';
import type { CreateClient, DeleteClient, ListClient, ReadClient, UpdateClient } from '../client/client';
import { useState } from 'react';

export const useModelResource = <
  MLReq extends ModelListRequest,
  MLRes extends ModelListResponse,
  MReq extends ModelRequest,
  MRes extends ModelResponse,
>({
  listClient,
  createClient,
  readClient,
  updateClient,
  deleteClient,
}: {
  listClient?: ListClient<MLReq, MLRes>;
  createClient?: CreateClient<MReq, MRes>;
  readClient?: ReadClient<MRes>;
  updateClient?: UpdateClient<MReq, MRes>;
  deleteClient?: DeleteClient;
}) => {
  const [isLoading, setLoading] = useState<'list' | 'create' | 'read' | 'update' | 'delete' | undefined>();
  const [modelList, setModelList] = useState<MLRes | undefined>();
  const [model, setModel] = useState<MRes | undefined>();
  const [httpError, setHttpError] = useState<HttpError | undefined>();

  const listModel = async (req: MLReq): Promise<boolean> => {
    if (!listClient) {
      throw new Error('Missing listClient');
    }

    setLoading('list');

    const response = await listClient(req);

    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModelList(response);
      success = true;
    }

    setLoading(undefined);

    return success;
  };

  const createModel = async (req: MReq): Promise<boolean> => {
    if (!createClient) {
      throw new Error('Missing createClient');
    }

    setLoading('create');

    const response = await createClient(req);

    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
      success = true;
    }

    setLoading(undefined);

    return success;
  };

  const readModel = async (id: string): Promise<boolean> => {
    if (!readClient) {
      throw new Error('Missing readClient');
    }

    setLoading('read');

    const response = await readClient(id);

    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
      success = true;
    }

    setLoading(undefined);

    return success;
  };

  const updateModel = async (id: string, req: MReq): Promise<boolean> => {
    if (!updateClient) {
      throw new Error('Missing updateClient');
    }

    setLoading('update');

    const response = await updateClient(id, req);

    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
      success = true;
    }

    setLoading(undefined);

    return success;
  };

  const deleteModel = async (id: string): Promise<boolean> => {
    if (!deleteClient) {
      throw new Error('Missing deleteClient');
    }

    setLoading('update');

    const response = await deleteClient(id);

    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      setModel(response);
      success = true;
    }

    setLoading(undefined);

    return success;
  };

  return {
    isLoading,
    modelList,
    model,
    httpError,
    actions: { listModel, createModel, readModel, updateModel, deleteModel },
  };
};
