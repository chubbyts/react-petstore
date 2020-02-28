import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetForm from '../../Form/PetForm';
import { Button } from 'semantic-ui-react';
import { CreatePet } from '../../../ApiClient/Pet';

const Create = () => {

    useEffect(() => {
        document.title = 'Create Pet';
    }, []);

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Create Pet</h1>
            </div>
            <div className='row'>
                <div className='ui top attached segment'>
                    <PetForm apiCall={CreatePet} />
                </div>
            </div>
            <div className='row'>
                <Button as={Link} to='/pet'>List</Button>
            </div>
        </main>
    );
};

export default Create;
