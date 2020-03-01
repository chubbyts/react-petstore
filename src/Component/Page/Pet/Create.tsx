import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { CreatePet } from '../../../ApiClient/Pet';
import { Link, useHistory } from 'react-router-dom';
import HttpError from '../../../Type/Error/HttpError';
import InternalServerError from '../../../Type/Error/InternalServerError';
import PageInternalServerError from '../Error/InternalServerError';
import Pet from '../../../Type/Pet/Pet';
import PetForm from '../../Form/PetForm';

const Create = () => {

    const history = useHistory();

    const [pet, setPet] = useState<Pet | InternalServerError>();

    document.title = 'Create Pet';

    const submitPet = async (pet: Pet) => {
        const responsePet = await CreatePet(pet);

        setPet(responsePet);

        if (!(responsePet instanceof HttpError)) {
            history.push('/pet');
        }
    };

    if (pet instanceof InternalServerError) {
        return (
            <PageInternalServerError />
        );
    }

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Create Pet</h1>
            </div>
            <div className='row'>
                <div className='ui top attached segment'>
                    <PetForm submitPet={submitPet} pet={pet} />
                </div>
            </div>
            <div className='row'>
                <Button as={Link} to='/pet'>List</Button>
            </div>
        </main>
    );
};

export default Create;
