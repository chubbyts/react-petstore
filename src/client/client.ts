import { throwableToError } from '@chubbyts/chubbyts-throwable-to-error/dist/throwable-to-error';
import qs from 'qs';
import type { z } from 'zod';
import type { HttpError } from './error';
import { BadRequest, InternalServerError, NetworkError, NotFound, Unauthorized, UnprocessableEntity } from './error';

export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type GetAccessToken = () => Promise<string | undefined>;

export const createAuthenticatedFetch = (fetch: Fetch, getAccessToken: GetAccessToken): Fetch => {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return fetch(input, init);
    }

    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    return fetch(input, { ...init, headers: Object.fromEntries(headers.entries()) });
  };
};

// the api responds without a body, but with a www-authenticate header
const createUnauthorized = (): Unauthorized => {
  return new Unauthorized({ title: 'Unauthorized', detail: 'The access token is missing, invalid or expired' });
};

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

      if (401 === response.status) {
        return createUnauthorized();
      }

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

      if (401 === response.status) {
        return createUnauthorized();
      }

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

      if (401 === response.status) {
        return createUnauthorized();
      }

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

      if (401 === response.status) {
        return createUnauthorized();
      }

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

      if (401 === response.status) {
        return createUnauthorized();
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
