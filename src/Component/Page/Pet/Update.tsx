import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import Empty from '../Empty';
import HttpError from '../../../Type/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import Pet from '../../../Type/Pet/Pet';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Type/Error/UnprocessableEntity';

type props = RouteComponentProps<{ id: string; }>;

const Update = ({ match }: props) => {

    const id = match.params.id;

    const history = useHistory();

    const [pet, setPet] = useState<Pet>();
    const [httpError, setHttpError] = useState<HttpError>();

    useEffect(() => {
        fetchPet(id);

        document.title = 'Update Pet';
    }, [id]);

    const fetchPet = async (id: string) => {
        const response = await ReadPet(id);

        if (response instanceof HttpError) {
            setHttpError(response);
        } else {
            setHttpError(undefined);
            setPet(response);
        }
    };

    const submitPet = async (pet: Pet) => {
        const response = await UpdatePet(pet);

        if (response instanceof HttpError) {
            setHttpError(response);
        } else {
            setHttpError(undefined);
            setPet(response);

            history.push('/pet');
        }
    };

    if (!pet && !httpError) {
        return (<Empty />);
    }

    return (
        <main className='ui padded grid'>
            {httpError instanceof HttpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <div className='row'>
                <h1 className='ui huge dividing header'>Update Pet</h1>
            </div>
            {pet ? (
                <div className='row'>
                    <div className='ui attached segment'>
                        <PetForm submitPet={submitPet} pet={pet} error={httpError instanceof UnprocessableEntity ? httpError : undefined} />
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

