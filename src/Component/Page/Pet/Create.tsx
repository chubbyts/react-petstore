import React, { useEffect } from 'react';
import PetForm from '../../Form/PetForm';
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
        </main>
    );
}

export default Create;
