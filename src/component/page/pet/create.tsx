import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import type { PetRequest } from '../../../model/pet';
import { AnchorButton } from '../../button';
import { H1 } from '../../heading';
import { useModelResource } from '../../../hook/use-model-resource';
import { createPetClient as createClient } from '../../../client/pet';

const pageTitle = 'Pet Create';

const Create: FC = () => {
  const navigate = useNavigate();

  const { httpError, actions } = useModelResource({ createClient });

  const submitPet = async (pet: PetRequest) => {
    if (await actions.createModel(pet)) {
      navigate('/pet');
    }
  };

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  return (
    <div data-testid="page-pet-create">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <H1>{pageTitle}</H1>
      <PetForm httpError={httpError} submitPet={submitPet} />
      <AnchorButton to="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default Create;
