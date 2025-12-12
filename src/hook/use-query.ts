import { HttpError } from '../client/error';
import type { CreateClient, DeleteClient, ListClient, ReadClient, UpdateClient } from '../client/client';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../model/model';

export const provideListQueryFn = <MLReq extends ModelListRequest, MLRes extends ModelListResponse>(
  listClient: ListClient<MLReq, MLRes>,
  modelListRequest: MLReq,
  auth: any
) => {
  return async (): Promise<MLRes> => {
    const modelListResponse = await listClient(modelListRequest, auth);

    if (modelListResponse instanceof HttpError) {
      throw modelListResponse;
    }

    return modelListResponse;
  };
};

export const provideCreateMutationFn = <MReq extends ModelRequest, MRes extends ModelResponse>(
  createClient: CreateClient<MReq, MRes>,
) => {
  return async (modelRequest: MReq): Promise<MRes> => {
    const modelResponse = await createClient(modelRequest);

    if (modelResponse instanceof HttpError) {
      throw modelResponse;
    }

    return modelResponse;
  };
};

export const provideReadQueryFn = <MRes extends ModelResponse>(readClient: ReadClient<MRes>, id: string) => {
  return async (): Promise<MRes> => {
    const modelResponse = await readClient(id);

    if (modelResponse instanceof HttpError) {
      throw modelResponse;
    }

    return modelResponse;
  };
};

export const provideUpdateMutationFn = <MReq extends ModelRequest, MRes extends ModelResponse>(
  updateClient: UpdateClient<MReq, MRes>,
) => {
  return async ([id, modelRequest]: [string, MReq]): Promise<MRes> => {
    const modelResponse = await updateClient(id, modelRequest);

    if (modelResponse instanceof HttpError) {
      throw modelResponse;
    }

    return modelResponse;
  };
};

export const provideDeleteMutationFn = (deleteClient: DeleteClient) => {
  return async (id: string): Promise<undefined> => {
    const modelResponse = await deleteClient(id);

    if (modelResponse instanceof HttpError) {
      throw modelResponse;
    }
  };
};
