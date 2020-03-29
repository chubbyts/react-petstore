import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetResponse from '../../../Model/Pet/PetResponse';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Model/Error/UnprocessableEntity';
import PetRequest from '../../../Model/Pet/PetRequest';

type Props = RouteComponentProps<{ id: string; }>;

const Update: React.FC<Props> = ({ match }: Props) => {

    const id = match.params.id;

    const history = useHistory();

    const [pet, setPet] = useState<PetResponse>();
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

    const submitPet = async (pet: PetRequest) => {
        const response = await UpdatePet(id, pet);

        if (response instanceof HttpError) {
            setHttpError(response);
        } else {
            setHttpError(undefined);
            setPet(response);

            history.push('/pet');
        }
    };

    if (!pet && !httpError) {
        return (<main className='ui padded grid'></main>);
    }

    return (
        <main data-testid='page-pet-update' className='ui padded grid'>
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

