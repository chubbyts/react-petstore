import BadRequest from '../Model/Error/BadRequest';
import HttpError from '../Model/Error/HttpError';
import InternalServerError from '../Model/Error/InternalServerError';
import NetworkError from '../Model/Error/NetworkError';
import NotFound from '../Model/Error/NotFound';
import UnprocessableEntity from '../Model/Error/UnprocessableEntity';
import { PetList, petListSchema, PetRequest, PetResponse, petResponseSchema } from '../Model/model';
import { throwableToError } from '../throwable-to-error';

const url = `${import.meta.env.VITE_PETSTORE_URL}/api/pets`;

export const ListPets = async (queryString: string): Promise<HttpError | PetList> => {
  try {
    const response: Response = await fetch(`${url}?${queryString}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();

    if (200 === response.status) {
      return petListSchema.parse(json);
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

export const CreatePet = async (pet: PetRequest): Promise<HttpError | PetResponse> => {
  try {
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pet),
    });

    const json = await response.json();

    if (201 === response.status) {
      return petResponseSchema.parse(json);
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

export const ReadPet = async (id: string): Promise<HttpError | PetResponse> => {
  try {
    const response: Response = await fetch(`${url}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();

    if (200 === response.status) {
      return petResponseSchema.parse(json);
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

export const UpdatePet = async (id: string, pet: PetRequest): Promise<HttpError | PetResponse> => {
  try {
    const response: Response = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pet),
    });

    const json = await response.json();

    if (200 === response.status) {
      return petResponseSchema.parse(json);
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

export const DeletePet = async (id: string): Promise<HttpError | PetResponse | undefined> => {
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
