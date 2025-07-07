import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { AnchorButton } from '../../button';
import { H1 } from '../../heading';
import { createPetClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideCreateMutationFn } from '../../../hook/use-query';

const pageTitle = 'Pet Create';

const Create: FC = () => {
  const navigate = useNavigate();

  const petMutation = useMutation<PetResponse, HttpError, PetRequest>({
    mutationFn: provideCreateMutationFn(createPetClient),
    onSuccess: () => {
      navigate('/pet');
    },
    retry: false,
  });

  const submitPet = async (petRequest: PetRequest) => {
    petMutation.mutate(petRequest);
  };

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  }, []);

  return (
    <div data-testid="page-pet-create">
      {petMutation.error ? <HttpErrorPartial httpError={petMutation.error} /> : null}
      <H1>{pageTitle}</H1>
      <PetForm httpError={petMutation.error ?? undefined} submitPet={submitPet} />
      <AnchorButton to="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default Create;
