import React, { useState, useEffect } from 'react';
import { Button, Message } from 'semantic-ui-react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import Empty from '../Empty';
import HttpError from '../../../Type/Error/HttpError';
import InternalServerError from '../../../Type/Error/InternalServerError';
import NotFound from '../../../Type/Error/NotFound';
import Pet from '../../../Type/Pet/Pet';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Type/Error/UnprocessableEntity';

const Update = ({ match }: RouteComponentProps<{ id: string; }>) => {

    const id = match.params.id;

    const history = useHistory();

    const [pet, setPet] = useState<Pet>();
    const [error, setError] = useState<InternalServerError | NotFound | UnprocessableEntity>();

    useEffect(() => {
        const fetchPet = async () => {
            const response = await ReadPet(id);

            if (response instanceof HttpError) {
                setError(response);
            } else {
                setError(undefined);
                setPet(response);
            }
        };

        fetchPet();

        document.title = 'Update Pet';
    }, [id]);

    const submitPet = async (pet: Pet) => {
        const response = await UpdatePet(pet);

        if (response instanceof HttpError) {
            setError(response);
        } else {
            setError(undefined);
            setPet(response);

            history.push('/pet');
        }
    };

    if (!pet && !error) {
        return (<Empty />);
    }

    return (
        <main className='ui padded grid'>
            {error instanceof HttpError ? (
                <div className='row'>
                    <Message negative className='attached segment'>
                        <Message.Header>{error.title}</Message.Header>
                        <p>{error.detail}</p>
                    </Message>
                </div>
            ) : ''}
            <div className='row'>
                <h1 className='ui huge dividing header'>Update Pet</h1>
            </div>
            {pet ? (
                <div className='row'>
                    <div className='ui top attached segment'>
                        <PetForm submitPet={submitPet} pet={pet} error={error instanceof UnprocessableEntity ? error : undefined} />
                    </div>
                </div>
            ) : ''}
            <div className='row'>
                <Button as={Link} to='/pet'>List</Button>
            </div>
        </main>
    );
};

export default Update;

