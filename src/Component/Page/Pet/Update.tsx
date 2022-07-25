import { FC, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetResponse from '../../../Model/Pet/PetResponse';
import PetForm from '../../Form/PetForm';
import PetRequest from '../../../Model/Pet/PetRequest';
import HttpErrorWithInvalidParameters from '../../../Model/Error/HttpErrorWithInvalidParameters';

const Update: FC = () => {
  const params = useParams();
  const id = params.id as string;

  const navigate = useNavigate();

  const [pet, setPet] = useState<PetResponse>();
  const [httpError, setHttpError] = useState<HttpError>();

  const fetchPet = async () => {
    const response = await ReadPet(id);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      setPet(response);
    }
  };

  const submitPet = async (petRequest: PetRequest) => {
    const response = await UpdatePet(id, petRequest);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      setPet(response);

      navigate('/pet');
    }
  };

  useEffect(() => {
    document.title = 'Update Pet';

    fetchPet();
  }, [id]);

  if (!pet && !httpError) {
    return <div></div>;
  }

  return (
    <div data-testid="page-pet-update">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <h1>Update Pet</h1>
      {pet ? (
        <PetForm
          submitPet={submitPet}
          defaultPet={pet}
          error={httpError instanceof HttpErrorWithInvalidParameters ? httpError : undefined}
        />
      ) : null}
      <Link to="/pet" className="btn-gray">
        List
      </Link>
    </div>
  );
};

export default Update;
