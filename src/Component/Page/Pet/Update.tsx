import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import Empty from '../Empty';
import InternalServerError from '../../../Type/Error/InternalServerError';
import NotFound from '../../../Type/Error/NotFound';
import PageInternalServerError from '../Error/InternalServerError';
import PageNotFound from '../Error/NotFound';
import Pet from '../../../Type/Pet/Pet';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Type/Error/UnprocessableEntity';
import HttpError from '../../../Type/Error/HttpError';

const Update = ({ match }: RouteComponentProps<{ id: string; }>) => {

    const id = match.params.id;

    const history = useHistory();

    const [pet, setPet] = useState<Pet | InternalServerError | NotFound | UnprocessableEntity>();

    useEffect(() => {
        const fetchPet = async () => {
            setPet(await ReadPet(id));
        };

        fetchPet();

        document.title = 'Update Pet';
    }, [id]);

    const submitPet = async (pet: Pet) => {
        const responsePet = await UpdatePet(pet);

        setPet(responsePet);

        if (!(responsePet instanceof HttpError)) {
            history.push('/pet');
        }
    };

    if (!pet) {
        return (<Empty />);
    }

    if (pet instanceof InternalServerError) {
        return (<PageInternalServerError />);
    }

    if (pet instanceof NotFound) {
        return (<PageNotFound message={`Missing pet: ${id}`} />);
    }

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Update Pet</h1>
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

export default Update;

