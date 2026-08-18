import { fetch as crossFetch } from 'cross-fetch';
import { petListRequestSchema, petListResponseSchema, petRequestSchema, petResponseSchema } from '../model/pet';
import { getAccessToken } from '../oidc';
import {
  createAuthenticatedFetch,
  createCreateClient,
  createDeleteClient,
  createListClient,
  createReadClient,
  createUpdateClient,
} from './client';

const fetch = createAuthenticatedFetch(crossFetch, getAccessToken);
const url = `${import.meta.env.VITE_PETSTORE_URL}/api/pets`;

export const listPetsClient = createListClient(fetch, url, petListRequestSchema, petListResponseSchema);
export const createPetClient = createCreateClient(fetch, url, petRequestSchema, petResponseSchema);
export const readPetClient = createReadClient(fetch, url, petResponseSchema);
export const updatePetClient = createUpdateClient(fetch, url, petRequestSchema, petResponseSchema);
export const deletePetClient = createDeleteClient(fetch, url);
