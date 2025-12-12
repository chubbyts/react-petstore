import { throwableToError } from '@chubbyts/chubbyts-throwable-to-error/dist/throwable-to-error';
import qs from 'qs';
import type { z } from 'zod';
import type { HttpError } from './error';
import { BadRequest, InternalServerError, NetworkError, NotFound, UnprocessableEntity } from './error';

export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type ListClient<ModelListRequest, ModelListResponse> = (
  modelListRequest: ModelListRequest,
  auth: any
) => Promise<HttpError | ModelListResponse>;

export const createListClient = <ModelListRequestSchema extends z.ZodType, ModelListResponseSchema extends z.ZodType>(
  fetch: Fetch,
  url: string,
  modelListRequestSchema: ModelListRequestSchema,
  modelListResponseSchema: ModelListResponseSchema,
): ListClient<z.infer<typeof modelListRequestSchema>, z.infer<typeof modelListResponseSchema>> => {
  return async (
    modelListRequest: z.infer<typeof modelListRequestSchema>,
    auth: any
  ): Promise<z.infer<typeof modelListResponseSchema> | HttpError> => {
    try {
      const response: Response = await fetch(`${url}?${qs.stringify(modelListRequestSchema.parse(modelListRequest))}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `bearer ${auth.user.access_token}`,
        },
      });

      const json = await response.json();

      if (200 === response.status) {
        return modelListResponseSchema.parse(json);
      }

      if (400 === response.status) {
        return new BadRequest({ ...json });
      }

      if (500 === response.status) {
        return new InternalServerError({ ...json });
      }
    } catch (error) {
      return new NetworkError({ title: throwableToError(error).message });
    }

    throw new Error('Unknown response');
  };
};

export type CreateClient<ModelRequest, ModelResponse> = (
  modelRequest: ModelRequest,
) => Promise<ModelResponse | HttpError>;

export const createCreateClient = <ModelRequestSchema extends z.ZodType, ModelResponseSchema extends z.ZodType>(
  fetch: Fetch,
  url: string,
  modelRequestSchema: ModelRequestSchema,
  modelResponseSchema: ModelResponseSchema,
): CreateClient<z.infer<typeof modelRequestSchema>, z.infer<typeof modelResponseSchema>> => {
  return async (
    modelRequest: z.infer<typeof modelRequestSchema>,
  ): Promise<z.infer<typeof modelResponseSchema> | HttpError> => {
    try {
      const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelRequestSchema.parse(modelRequest)),
      });

      const json = await response.json();

      if (201 === response.status) {
        return modelResponseSchema.parse(json);
      }

      if (400 === response.status) {
        return new BadRequest({ ...json });
      }

      if (422 === response.status) {
        return new UnprocessableEntity({ ...json });
      }

      if (500 === response.status) {
        return new InternalServerError({ ...json });
      }
    } catch (error) {
      return new NetworkError({ title: throwableToError(error).message });
    }

    throw new Error('Unknown response');
  };
};

export type ReadClient<ModelResponse> = (id: string) => Promise<ModelResponse | HttpError>;

export const createReadClient = <ModelResponseSchema extends z.ZodType>(
  fetch: Fetch,
  url: string,
  modelResponseSchema: ModelResponseSchema,
): ReadClient<z.infer<typeof modelResponseSchema>> => {
  return async (id: string): Promise<z.infer<typeof modelResponseSchema> | HttpError> => {
    try {
      const response: Response = await fetch(`${url}/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      const json = await response.json();

      if (200 === response.status) {
        return modelResponseSchema.parse(json);
      }

      if (404 === response.status) {
        return new NotFound({ ...json });
      }

      if (500 === response.status) {
        return new InternalServerError({ ...json });
      }
    } catch (error) {
      return new NetworkError({ title: throwableToError(error).message });
    }

    throw new Error('Unknown response');
  };
};

export type UpdateClient<ModelRequest, ModelResponse> = (
  id: string,
  modelRequest: ModelRequest,
) => Promise<ModelResponse | HttpError>;

export const createUpdateClient = <ModelRequestSchema extends z.ZodType, ModelResponseSchema extends z.ZodType>(
  fetch: Fetch,
  url: string,
  modelRequestSchema: ModelRequestSchema,
  modelResponseSchema: ModelResponseSchema,
): UpdateClient<z.infer<typeof modelRequestSchema>, z.infer<typeof modelResponseSchema>> => {
  return async (
    id: string,
    modelRequest: z.infer<typeof modelRequestSchema>,
  ): Promise<z.infer<typeof modelResponseSchema> | HttpError> => {
    try {
      const response: Response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelRequestSchema.parse(modelRequest)),
      });

      const json = await response.json();

      if (200 === response.status) {
        return modelResponseSchema.parse(json);
      }

      if (400 === response.status) {
        return new BadRequest({ ...json });
      }

      if (404 === response.status) {
        return new NotFound({ ...json });
      }

      if (422 === response.status) {
        return new UnprocessableEntity({ ...json });
      }

      if (500 === response.status) {
        return new InternalServerError({ ...json });
      }
    } catch (error) {
      return new NetworkError({ title: throwableToError(error).message });
    }

    throw new Error('Unknown response');
  };
};

export type DeleteClient = (id: string) => Promise<undefined | HttpError>;

export const createDeleteClient = (fetch: Fetch, url: string): DeleteClient => {
  return async (id: string): Promise<HttpError | undefined> => {
    try {
      const response: Response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      if (204 === response.status) {
        return;
      }

      const json = await response.json();

      if (404 === response.status) {
        return new NotFound({ ...json });
      }

      if (500 === response.status) {
        return new InternalServerError({ ...json });
      }
    } catch (error) {
      return new NetworkError({ title: throwableToError(error).message });
    }

    throw new Error('Unknown response');
  };
};
