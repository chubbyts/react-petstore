import BadRequest from '../Type/Error/BadRequest';
import HttpError from '../Type/Error/HttpError';
import InternalServerError from '../Type/Error/InternalServerError';
import NetworkError from '../Type/Error/NetworkError';
import NotFound from '../Type/Error/NotFound';
import Pet from '../Type/Pet/Pet';
import PetList from '../Type/Pet/PetList';
import UnprocessableEntity from '../Type/Error/UnprocessableEntity';

const url = `${process.env.REACT_APP_PETSTORE_URL}/api/pets`;

export const ListPets = async (queryString: string): Promise<HttpError | PetList> => {
    try {
        const response = await fetch(`${url}?${queryString}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const json = await response.json();

        if (200 === response.status) {
            return json;
        }

        if (400 === response.status) {
            return new BadRequest({ ...json });
        }

        if (500 === response.status) {
            return new InternalServerError({ ...json });
        }
    } catch (error) {
        return new NetworkError({ title: error.message });
    }

    throw new Error('Invalid response');
};

export const ReadPet = async (id: string): Promise<HttpError | Pet> => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const json = await response.json();

        if (200 === response.status) {
            return json;
        }

        if (404 === response.status) {
            return new NotFound({ ...json });
        }

        if (500 === response.status) {
            return new InternalServerError({ ...json });
        }
    } catch (error) {
        return new NetworkError({ title: error.message });
    }

    throw new Error('Invalid response');
};

export const CreatePet = async (pet: Pet): Promise<HttpError | Pet> => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet)
        });

        const json = await response.json();

        if (201 === response.status) {
            return json;
        }

        if (422 === response.status) {
            return new UnprocessableEntity({ ...json });
        }

        if (500 === response.status) {
            return new InternalServerError({ ...json });
        }
    } catch (error) {
        return new NetworkError({ title: error.message });
    }

    throw new Error('Invalid response');
};

export const UpdatePet = async (pet: Pet): Promise<HttpError | Pet> => {
    try {
        const response = await fetch(`${url}/${pet.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet)
        });

        const json = await response.json();

        if (200 === response.status) {
            return json;
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
        return new NetworkError({ title: error.message });
    }

    throw new Error('Invalid response');
};

export const DeletePet = async (pet: Pet): Promise<HttpError | Pet | undefined> => {
    try {
        const response = await fetch(`${url}/${pet.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            }
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
        return new NetworkError({ title: error.message });
    }

    throw new Error('Invalid response');
};
