import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetFiltersForm } from '../../form/pet-filters-form';
import { Pagination } from '../../partial/pagination';
import { H1 } from '../../heading';
import { AnchorButton, Button } from '../../button';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { numberSchema } from '../../../model/model';
import type { PetListRequest, PetSort, PetFilters, PetResponse, PetListResponse } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { deletePetClient, listPetsClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideDeleteMutationFn, provideListQueryFn } from '../../../hook/use-query';

const pageTitle = 'Pet List';

const limit = 10;

const querySchema = z.object({
  page: numberSchema.optional().default(1),
  filters: petFiltersSchema.optional().default({}),
  sort: petSortSchema.optional().default({}),
});

const List: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => querySchema.parse(qs.parse(location.search.substring(1))), [location]);
  const queryClient = useQueryClient();

  const petListRequest: PetListRequest = useMemo(
    () => ({
      offset: query.page * limit - limit,
      limit,
      filters: query.filters,
      sort: query.sort,
    }),
    [query.filters, query.page, query.sort],
  );

  const queryKey = useMemo(() => ['pets', qs.stringify(petListRequest)], [petListRequest]);

  const petListQuery = useQuery<PetListResponse, HttpError>({
    queryKey,
    queryFn: provideListQueryFn(listPetsClient, petListRequest),
    retry: false,
  });

  const petDeleteMutation = useMutation<unknown, HttpError, string>({
    mutationFn: provideDeleteMutationFn(deletePetClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    retry: false,
  });

  const deletePet = async (id: string) => {
    petDeleteMutation.mutate(id);
  };

  const submitPage = (page: number): void => {
    navigate(`/pet?${qs.stringify({ ...query, page })}`);
  };

  const submitPetFilters = (filters: PetFilters): void => {
    navigate(`/pet?${qs.stringify({ ...query, page: 1, filters })}`);
  };

  const submitPetSort = (sort: PetSort): void => {
    navigate(`/pet?${qs.stringify({ ...query, page: 1, sort })}`);
  };

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  }, []);

  if (petListQuery.isLoading) {
    return <div></div>;
  }

  const error = petDeleteMutation.error ?? petListQuery.error;

  return (
    <div data-testid="page-pet-list">
      {error ? <HttpErrorPartial httpError={error} /> : null}
      <H1>{pageTitle}</H1>
      {petListQuery.data ? (
        <div>
          {petListQuery.data._links?.create ? (
            <AnchorButton to="/pet/create" colorTheme="green" className="mb-4">
              Create
            </AnchorButton>
          ) : null}
          <PetFiltersForm
            httpError={petListQuery.error ?? undefined}
            initialPetFilters={query.filters}
            submitPetFilters={submitPetFilters}
          />
          <div className="mt-4">
            <Table>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>CreatedAt</Th>
                  <Th>UpdatedAt</Th>
                  <Th>
                    <span>Name (</span>
                    <button
                      data-testid="pet-sort-name-asc"
                      onClick={() => submitPetSort({ ...query.sort, name: 'asc' })}
                    >
                      <span className="mx-1 inline-block">A-Z</span>
                    </button>
                    <span>|</span>
                    <button
                      data-testid="pet-sort-name-desc"
                      onClick={() => submitPetSort({ ...query.sort, name: 'desc' })}
                    >
                      <span className="mx-1 inline-block">Z-A</span>
                    </button>
                    <span>|</span>
                    <button
                      data-testid="pet-sort-name--"
                      onClick={() => submitPetSort({ ...query.sort, name: undefined })}
                    >
                      <span className="mx-1 inline-block">---</span>
                    </button>
                    <span>)</span>
                  </Th>
                  <Th>Tag</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {petListQuery.data.items.map((pet: PetResponse, i) => (
                  <Tr key={pet.id}>
                    <Td>{pet.id}</Td>
                    <Td>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</Td>
                    <Td>
                      {pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                    </Td>
                    <Td>{pet.name}</Td>
                    <Td>{pet.tag}</Td>
                    <Td>
                      {pet._links?.read ? (
                        <AnchorButton to={`/pet/${pet.id}`} colorTheme="gray" className="mr-4">
                          Read
                        </AnchorButton>
                      ) : null}
                      {pet._links?.update ? (
                        <AnchorButton to={`/pet/${pet.id}/update`} colorTheme="gray" className="mr-4">
                          Update
                        </AnchorButton>
                      ) : null}
                      {pet._links?.delete ? (
                        <Button
                          data-testid={`remove-pet-${i}`}
                          onClick={() => {
                            deletePet(pet.id);
                          }}
                          colorTheme="red"
                        >
                          Delete
                        </Button>
                      ) : null}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={query.page}
              totalPages={Math.ceil(petListQuery.data.count / petListQuery.data.limit)}
              maxPages={7}
              submitPage={submitPage}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default List;
