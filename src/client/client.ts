import { throwableToError } from '@chubbyts/chubbyts-throwable-to-error/dist/throwable-to-error';
import qs from 'qs';
import type { z } from 'zod';
import type { HttpError } from './error';
import { BadRequest, InternalServerError, NetworkError, NotFound, UnprocessableEntity } from './error';

export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type ListClient<ModelListRequest, ModelListResponse> = (
  modelListRequest: ModelListRequest,
) => Promise<HttpError | ModelListResponse>;

export const createListClient = <
  ModelListRequestSchema extends z.ZodObject,
  ModelListResponseSchema extends z.ZodObject,
>(
  fetch: Fetch,
  url: string,
  modelListRequestSchema: ModelListRequestSchema,
  modelListResponseSchema: ModelListResponseSchema,
): ListClient<z.input<ModelListRequestSchema>, z.output<ModelListResponseSchema>> => {
  return async (
    modelListRequest: z.input<ModelListRequestSchema>,
  ): Promise<z.output<ModelListResponseSchema> | HttpError> => {
    try {
      const response: Response = await fetch(`${url}?${qs.stringify(modelListRequestSchema.parse(modelListRequest))}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
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

export const createCreateClient = <ModelRequestSchema extends z.ZodObject, ModelResponseSchema extends z.ZodObject>(
  fetch: Fetch,
  url: string,
  modelRequestSchema: ModelRequestSchema,
  modelResponseSchema: ModelResponseSchema,
): CreateClient<z.input<ModelRequestSchema>, z.output<ModelResponseSchema>> => {
  return async (modelRequest: z.input<ModelRequestSchema>): Promise<z.output<ModelResponseSchema> | HttpError> => {
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

export const createReadClient = <ModelResponseSchema extends z.ZodObject>(
  fetch: Fetch,
  url: string,
  modelResponseSchema: ModelResponseSchema,
): ReadClient<z.output<ModelResponseSchema>> => {
  return async (id: string): Promise<z.output<ModelResponseSchema> | HttpError> => {
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

export const createUpdateClient = <ModelRequestSchema extends z.ZodObject, ModelResponseSchema extends z.ZodObject>(
  fetch: Fetch,
  url: string,
  modelRequestSchema: ModelRequestSchema,
  modelResponseSchema: ModelResponseSchema,
): UpdateClient<z.input<ModelRequestSchema>, z.output<ModelResponseSchema>> => {
  return async (
    id: string,
    modelRequest: z.input<ModelRequestSchema>,
  ): Promise<z.output<ModelResponseSchema> | HttpError> => {
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
