import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Pet from '../../../Type/Pet/Pet';
import PetForm from '../../Form/PetForm';
import NotFound from '../../../Type/Error/NotFound';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import { Button } from 'semantic-ui-react';
import PageNotFound from '../Error/NotFound';

const Edit = ({ match }: RouteComponentProps<{ id: string }>) => {

    const id = match.params.id;

    const [pet, setPet] = useState<Pet | NotFound>();

    useEffect(() => {
        const fetchPet = async () => {
            setPet(await ReadPet(id));
        };

        fetchPet();

        document.title = 'Edit Pet';
    }, [id]);

    if (!pet) {
        return (
            <main className='ui padded grid'></main>
        );
    }

    if (pet instanceof NotFound) {
        return (
            <PageNotFound message={`Missing pet: ${id}`} />
        );
    }

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Edit Pet</h1>
            </div>
            <div className='row'>
                <div className='ui top attached segment'>
                    <PetForm apiCall={UpdatePet} pet={pet} />
                </div>
            </div>
            <div className='row'>
                <Button as={Link} to='/pet'>List</Button>
            </div>
        </main>
    );
}

export default Edit;

