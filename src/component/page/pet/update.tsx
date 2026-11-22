import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loading } from '../../partial/loading';
import { BackToList } from '../../partial/back-to-list';
import { PetForm } from '../../form/pet-form';
import { Breadcrumb, PageHeader } from '../../heading';
import { Meta } from '../../card';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn, provideUpdateMutationFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Edit pet';

const Update: FC = () => {
  const params = useParams();
  const id = params.id as string;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToast();

  const petQuery = useQuery<PetResponse, HttpError>({
    queryKey: ['pets', id],
    queryFn: provideReadQueryFn(readClient, id),
    retry: false,
  });

  const petMutation = useMutation<PetResponse, HttpError, [string, PetRequest]>({
    mutationFn: provideUpdateMutationFn(updateClient),
    onSuccess: (pet) => {
      showToast(`Saved “${pet.name}” — 200 OK`);
      queryClient.setQueryData(['pets', id], pet);
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
      void navigate(`/pet/${id}`);
    },
    retry: false,
  });

  const submitPet = (petRequest: PetRequest): void => {
    petMutation.mutate([id, petRequest]);
  };

  const pet = petQuery.data;
  const title = pet ? `Edit ${pet.name}` : pageTitle;

  useDocumentTitle(title);
  usePageError(petMutation.error ?? petQuery.error, { focus: Boolean(petMutation.error) });

  if (petQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div data-testid="page-pet-update" className="flex flex-col gap-[22px]">
      <Breadcrumb
        items={[
          { label: 'Pets', to: '/pet' },
          ...(pet ? [{ label: pet.name, to: `/pet/${id}` }] : []),
          { label: 'Edit' },
        ]}
      />
      <PageHeader title={title} action={pet ? undefined : <BackToList to="/pet" />} />
      {pet ? (
        <PetForm
          httpError={petMutation.error ?? undefined}
          initialPet={pet}
          submitPet={submitPet}
          submitLabel="Save changes"
          cancelTo={`/pet/${id}`}
          listTo="/pet"
          meta={<Meta id={pet.id} createdAt={pet.createdAt} updatedAt={pet.updatedAt} />}
          isPending={petMutation.isPending}
        />
      ) : null}
    </div>
  );
};

export default Update;
