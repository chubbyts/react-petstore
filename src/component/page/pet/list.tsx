import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetFiltersForm } from '../../form/pet-filters-form';
import qs from 'qs';
import { Pagination } from '../../partial/pagination';
import { H1 } from '../../heading';
import { AnchorButton, Button } from '../../button';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { numberSchema } from '../../../model/model';
import type { PetListRequest, PetSort, PetFilters, PetResponse } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { z } from 'zod';
import { useModelResource } from '../../../hook/use-model-resource';
import { deletePetClient as deleteClient, listPetsClient as listClient } from '../../../client/pet';

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

  const {
    modelList: petList,
    httpError,
    actions,
  } = useModelResource({
    listClient,
    deleteClient,
  });

  const query = useMemo(() => querySchema.parse(qs.parse(location.search.substring(1))), [location]);

  const petListRequest: PetListRequest = {
    offset: query.page * limit - limit,
    limit,
    filters: query.filters,
    sort: query.sort,
  };

  const queryString = qs.stringify(petListRequest);

  const fetchPetList = async () => {
    actions.listModel(petListRequest);
  };

  const deletePet = async (id: string) => {
    if (await actions.deleteModel(id)) {
      fetchPetList();
    }
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
    document.title = pageTitle;

    fetchPetList();
  }, [queryString]);

  if (!petList && !httpError) {
    return <div></div>;
  }

  return (
    <div data-testid="page-pet-list">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <H1>{pageTitle}</H1>
      {petList ? (
        <div>
          {petList._links?.create ? (
            <AnchorButton to="/pet/create" colorTheme="green" className="mb-4">
              Create
            </AnchorButton>
          ) : null}
          <PetFiltersForm httpError={httpError} initialPetFilters={query.filters} submitPetFilters={submitPetFilters} />
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
                {petList.items.map((pet: PetResponse, i) => (
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
              totalPages={Math.ceil(petList.count / petList.limit)}
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
