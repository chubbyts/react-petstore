import { FC, useState } from 'react';
import { CreatePet } from '../../../ApiClient/Pet';
import { Link, useHistory } from 'react-router-dom';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Model/Error/UnprocessableEntity';
import PetRequest from '../../../Model/Pet/PetRequest';

const Create: FC = () => {

    const history = useHistory();

    const [httpError, setHttpError] = useState<HttpError>();

    document.title = 'Create Pet';

    const submitPet = async (pet: PetRequest) => {
        const response = await CreatePet(pet);

        if (response instanceof HttpError) {
            setHttpError(response);
        } else {
            setHttpError(undefined);

            history.push('/pet');
        }
    };

    return (
        <div data-testid='page-pet-create'>
            {httpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <h1>Create Pet</h1>
            <PetForm submitPet={submitPet} unprocessableEntity={httpError instanceof UnprocessableEntity ? httpError : undefined} />
            <Link to='/pet' className='btn-gray'>List</Link>
        </div>
    );
};

export default Create;
