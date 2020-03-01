import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { CreatePet } from '../../../ApiClient/Pet';
import { Link, useHistory } from 'react-router-dom';
import HttpError from '../../../Type/Error/HttpError';
import InternalServerError from '../../../Type/Error/InternalServerError';
import Pet from '../../../Type/Pet/Pet';
import { Message } from 'semantic-ui-react';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Type/Error/UnprocessableEntity';

const Create = () => {

    const history = useHistory();

    const [pet, setPet] = useState<Pet | UnprocessableEntity>();
    const [internalServerError, setInternalServerError] = useState<InternalServerError>();

    document.title = 'Create Pet';

    const submitPet = async (pet: Pet) => {
        const responsePet = await CreatePet(pet);

        if (responsePet instanceof InternalServerError) {
            setInternalServerError(responsePet);
        } else {
            setInternalServerError(undefined);
            setPet(responsePet);
        }

        if (!(responsePet instanceof HttpError)) {
            history.push('/pet');
        }
    };

    return (
        <main className='ui padded grid'>
            {internalServerError ? (
                <div className='row'>
                    <Message negative className='attached segment'>
                        <Message.Header>{internalServerError.title}</Message.Header>
                        <p>{internalServerError.detail}</p>
                    </Message>
                </div>
            ) : ''}
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
