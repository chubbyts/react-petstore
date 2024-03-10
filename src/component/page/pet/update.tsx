import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import { H1 } from '../../heading';
import { AnchorButton } from '../../button';
import type { PetRequest } from '../../../model/pet';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import { useModelResource } from '../../../hook/use-model-resource';

const pageTitle = 'Pet Update';

const Update: FC = () => {
  const params = useParams();
  const id = params.id as string;

  const navigate = useNavigate();

  const { model: pet, httpError, actions } = useModelResource({ readClient, updateClient });

  const submitPet = async (petRequest: PetRequest) => {
    if (await actions.updateModel(id, petRequest)) {
      navigate('/pet');
    }
  };

  useEffect(() => {
    document.title = pageTitle;

    actions.readModel(id);
  }, [id]);

  if (!pet && !httpError) {
    return <div></div>;
  }

  return (
    <div data-testid="page-pet-update">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <H1>{pageTitle}</H1>
      {pet ? <PetForm httpError={httpError} initialPet={pet} submitPet={submitPet} /> : null}
      <AnchorButton to="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default Update;
