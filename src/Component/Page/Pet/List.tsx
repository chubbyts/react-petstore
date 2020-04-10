import React, { useState, useEffect } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ListPets, DeletePet } from '../../../ApiClient/Pet';
import BadRequest from '../../../Model/Error/BadRequest';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetResponse from '../../../Model/Pet/PetResponse';
import PetList from '../../../Model/Pet/PetList';
import qs from 'qs';
import PetFilterForm from '../../Form/PetFilterForm';
import Pagination from '../../Partial/Pagination';
import PetFilters from '../../../Model/Pet/PetFilters';

const List: React.FC = () => {

    const history = useHistory();
    const location = useLocation();

    const query = qs.parse(location.search.substr(1));

    const page = parseInt(query.page ? query.page : '1');
    const perPage = 10;
    const offset = (page * perPage) - perPage;
    const filters = query.filters ? query.filters : {};
    const sort = query.sort ? query.sort : {};

    const queryString = qs.stringify({ limit: perPage, offset: offset, filters: filters, sort: sort });

    const [petList, setPetList] = useState<PetList>();
    const [httpError, setHttpError] = useState<HttpError>();

    useEffect(() => {
        fetchPetList(queryString);

        document.title = 'List Pets';
    }, [queryString]);

    const fetchPetList = async (queryString: string) => {
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

            return;
        }

        setHttpError(undefined);

        fetchPetList(queryString);
    };

    const changePage = (page: number) => {
        history.push(`/pet?${qs.stringify({ ...query, page: page })}`);
    };

    const submitPetFilter = (filters: PetFilters) => {
        history.push(`/pet?${qs.stringify({ ...query, page: undefined, filters: filters })}`);
    };

    if (!petList && !httpError) {
        return (<div></div>);
    }

    return (
        <div data-testid='page-pet-list'>
            {httpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <h1>List Pets</h1>
            {petList ? (
                <div>
                    {petList._links.create ? (
                        <Link to='/pet/create' className='btn-green mb-4'>Create</Link>
                    ) : ''}
                    <PetFilterForm submitPetFilter={submitPetFilter} filters={filters} error={httpError instanceof BadRequest ? httpError : undefined} />
                    <table className="my-4">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>
                                    Name (
                                    <Link data-testid='sort-pet-name-asc' to={`/pet?${qs.stringify({ ...query, sort: { ...sort, name: 'asc' } })}`}> A-Z </Link> |
                                    <Link data-testid='sort-pet-name-desc' to={`/pet?${qs.stringify({ ...query, sort: { ...sort, name: 'desc' } })}`}> Z-A </Link> |
                                    <Link data-testid='sort-pet-name--' to={`/pet?${qs.stringify({ ...query, sort: { ...sort, name: undefined } })}`}> --- </Link>
                                    )
                                </th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {petList._embedded.items.map((pet: PetResponse, i) => (
                                <tr key={pet.id}>
                                    <td>{pet.id}</td>
                                    <td>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</td>
                                    <td>{pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</td>
                                    <td>{pet.name}</td>
                                    <td>{pet.tag}</td>
                                    <td>
                                        {pet._links.read ? (
                                            <Link to={`/pet/${pet.id}`} className='btn-gray mr-4'>Read</Link>
                                        ) : ''}
                                        {pet._links.update ? (
                                            <Link to={`/pet/${pet.id}/update`} className='btn-gray mr-4'>Update</Link>
                                        ) : ''}
                                        {pet._links.delete ? (
                                            <button data-testid={`remove-pet-${i}`} onClick={() => { deletePet(pet.id); }} className='btn-red'>Delete</button>
                                        ) : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination currentPage={page} totalPages={Math.ceil(petList.count / petList.limit)} maxPages={7} submitPage={changePage} />
                </div>
            ) : ''}
        </div>
    );
};

export default List;
