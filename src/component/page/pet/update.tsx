import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import { H1 } from '../../heading';
import { AnchorButton } from '../../button';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn, provideUpdateMutationFn } from '../../../hook/use-query';

const pageTitle = 'Pet Update';

const Update: FC = () => {
  const params = useParams();
  const id = params.id as string;

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const petQuery = useQuery<PetResponse, HttpError>({
    queryKey: ['pets', id],
    queryFn: provideReadQueryFn(readClient, id),
    retry: false,
  });

  const petMutation = useMutation<PetResponse, HttpError, [string, PetRequest]>({
    mutationFn: provideUpdateMutationFn(updateClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', id] });
      navigate('/pet');
    },
    retry: false,
  });

  const submitPet = async (petRequest: PetRequest) => {
    petMutation.mutate([id, petRequest]);
  };

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  }, []);

  if (petQuery.isLoading) {
    return <div></div>;
  }

  const error = petMutation.error ?? petQuery.error;

  return (
    <div data-testid="page-pet-update">
      {error ? <HttpErrorPartial httpError={error} /> : null}
      <H1>{pageTitle}</H1>
      {petQuery.data ? (
        <PetForm httpError={petMutation.error ?? undefined} initialPet={petQuery.data} submitPet={submitPet} />
      ) : null}
      <AnchorButton to="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default Update;
