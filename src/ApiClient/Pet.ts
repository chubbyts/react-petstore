import Pet from '../Type/Pet/Pet';
import NotFound from '../Type/Error/NotFound';
import BadRequest from '../Type/Error/BadRequest';
import UnprocessableEntity from '../Type/Error/UnprocessableEntity';
import PetList from '../Type/Pet/PetList';

const url = 'https://localhost:10443/api/pets';

export const ListPets = async (queryString: string): Promise<PetList | BadRequest> => {
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

    throw new Error('Invalid response');
};

export const ReadPet = async (id: string): Promise<Pet | NotFound> => {
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

    throw new Error('Invalid response');
};

export const CreatePet = async (pet: Pet): Promise<Pet | UnprocessableEntity> => {
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

    throw new Error('Invalid response');
};

export const UpdatePet = async (pet: Pet): Promise<Pet | NotFound | UnprocessableEntity> => {
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

    throw new Error('Invalid response');
};

export const DeletePet = async (pet: Pet): Promise<any> => {
    await fetch(`${url}/${pet.id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        }
    });
};
