import { FC, useState, useEffect } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ListPets, DeletePet } from '../../../api-client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetFilterForm } from '../../form/pet-filter-form';
import qs from 'qs';
import { PetFilters, PetList, PetResponse } from '../../../model/model';
import { BadRequest, HttpError } from '../../../api-client/error';
import { Pagination } from '../../partial/pagination';

const List: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const parsedQuery = qs.parse(location.search.substring(1));

  const query = {
    page: typeof parsedQuery.page === 'string' ? parseInt(parsedQuery.page) : 1,
    filters:
      typeof parsedQuery.filters === 'object' && !(parsedQuery.filters instanceof Array) ? parsedQuery.filters : {},
    sort: typeof parsedQuery.sort === 'object' && !(parsedQuery.sort instanceof Array) ? parsedQuery.sort : {},
  };

  const queryString = qs.stringify({
    limit: 10,
    offset: query.page * 10 - 10,
    filters: query.filters,
    sort: query.sort,
  });

  const [petList, setPetList] = useState<PetList>();
  const [httpError, setHttpError] = useState<HttpError>();

  const fetchPetList = async () => {
    const response = await ListPets(queryString);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      setPetList(response);
    }
  };

  const deletePet = async (id: string) => {
    const deleteResponse = await DeletePet(id);

    if (deleteResponse instanceof HttpError) {
      setHttpError(deleteResponse);
    } else {
      setHttpError(undefined);
      fetchPetList();
    }
  };

  const changePage = (page: number): void => {
    navigate(`/pet?${qs.stringify({ ...query, page })}`);
  };

  const submitPetFilter = (filters: PetFilters): void => {
    navigate(`/pet?${qs.stringify({ ...query, page: 1, filters })}`);
  };

  const sortLink = (field: string, order?: string): string => {
    return `/pet?${qs.stringify({
      ...query,
      sort: { ...query.sort, [field]: order },
    })}`;
  };

  useEffect(() => {
    document.title = 'List Pets';

    fetchPetList();
  }, [queryString]);

  if (!petList && !httpError) {
    return <div></div>;
  }

  return (
    <div data-testid="page-pet-list">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <h1>List Pets</h1>
      {petList ? (
        <div>
          {petList._links?.create ? (
            <Link to="/pet/create" className="btn-green mb-4">
              Create
            </Link>
          ) : null}
          <PetFilterForm
            submitPetFilter={submitPetFilter}
            defaultPetFilters={query.filters}
            badRequest={httpError instanceof BadRequest ? httpError : undefined}
          />
          <table className="my-4">
            <thead>
              <tr>
                <th>Id</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>
                  Name (
                  <Link data-testid="sort-pet-name-asc" to={sortLink('name', 'asc')}>
                    {' '}
                    A-Z{' '}
                  </Link>{' '}
                  |
                  <Link data-testid="sort-pet-name-desc" to={sortLink('name', 'desc')}>
                    {' '}
                    Z-A{' '}
                  </Link>{' '}
                  |
                  <Link data-testid="sort-pet-name--" to={sortLink('name')}>
                    {' '}
                    ---{' '}
                  </Link>
                  )
                </th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {petList.items.map((pet: PetResponse, i) => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</td>
                  <td>{pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</td>
                  <td>{pet.name}</td>
                  <td>{pet.tag}</td>
                  <td>
                    {pet._links?.read ? (
                      <Link to={`/pet/${pet.id}`} className="btn-gray mr-4">
                        Read
                      </Link>
                    ) : null}
                    {pet._links?.update ? (
                      <Link to={`/pet/${pet.id}/update`} className="btn-gray mr-4">
                        Update
                      </Link>
                    ) : null}
                    {pet._links?.delete ? (
                      <button
                        data-testid={`remove-pet-${i}`}
                        onClick={() => {
                          deletePet(pet.id);
                        }}
                        className="btn-red"
                      >
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={query.page}
            totalPages={Math.ceil(petList.count / petList.limit)}
            maxPages={7}
            submitPage={changePage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default List;
