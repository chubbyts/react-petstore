import { FC, useState } from 'react';
import { CreatePet } from '../../../ApiClient/Pet';
import { Link, useNavigate } from 'react-router-dom';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetForm from '../../Form/PetForm';
import HttpErrorWithInvalidParameters from '../../../Model/Error/HttpErrorWithInvalidParameters';
import { PetRequest } from '../../../Model/model';

const Create: FC = () => {
  const navigate = useNavigate();

  const [httpError, setHttpError] = useState<HttpError>();

  document.title = 'Create Pet';

  const submitPet = async (pet: PetRequest) => {
    const response = await CreatePet(pet);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);

      navigate('/pet');
    }
  };

  return (
    <div data-testid="page-pet-create">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <h1>Create Pet</h1>
      <PetForm
        submitPet={submitPet}
        error={httpError instanceof HttpErrorWithInvalidParameters ? httpError : undefined}
      />
      <Link to="/pet" className="btn-gray">
        List
      </Link>
    </div>
  );
};

export default Create;
