import { HttpError } from '../client/error';
import type { CreateClient, DeleteClient, ListClient, ReadClient, UpdateClient } from '../client/client';

export const provideListQueryFn = <MLReq, MLRes>(listClient: ListClient<MLReq, MLRes>, modelListRequest: MLReq) => {
  return async (): Promise<MLRes> => {
    const modelListResponse = await listClient(modelListRequest);

    if (modelListResponse instanceof HttpError) {
      throw modelListResponse;
    }

    return modelListResponse;
  };
};

export const provideCreateMutationFn = <MReq, MRes>(createClient: CreateClient<MReq, MRes>) => {
  return async (modelRequest: MReq): Promise<MRes> => {
    const modelResponse = await createClient(modelRequest);

    if (modelResponse instanceof HttpError) {
      throw modelResponse;
    }

    return modelResponse;
  };
};

export const provideReadQueryFn = <MRes>(readClient: ReadClient<MRes>, id: string) => {
  return async (): Promise<MRes> => {
    const modelResponse = await readClient(id);

    if (modelResponse instanceof HttpError) {
      throw modelResponse;
    }

    return modelResponse;
  };
};

export const provideUpdateMutationFn = <MReq, MRes>(updateClient: UpdateClient<MReq, MRes>) => {
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
