import { FC, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../api-client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import { PetRequest, PetResponse } from '../../../model/model';
import { HttpError, HttpErrorWithInvalidParameters } from '../../../api-client/error';

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
