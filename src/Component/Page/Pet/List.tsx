import React, { useState, useEffect } from 'react';
import { Button, Pagination, PaginationProps } from 'semantic-ui-react';
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

const List: React.FC = () => {

    const history = useHistory();
    const location = useLocation();

    const query = qs.parse(location.search.substr(1));

    const page = parseInt(query.page ? query.page : '1');
    const offset = (page * 10) - 10;
    const filters = query.filters ? query.filters : {};
    const sort = query.sort ? query.sort : {};

    const queryString = qs.stringify({ limit: 10, offset: offset, filters: filters, sort: sort });

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

    const changePage = (e: any, data: PaginationProps) => {
        history.push(`/pet?${qs.stringify({ ...query, page: data.activePage })}`);
    };

    const submitPetFilter = (filters: any) => {
        history.push(`/pet?${qs.stringify({ ...query, filters: filters })}`);
    };

    if (!petList && !httpError) {
        return (<main className='ui padded grid'></main>);
    }

    return (
        <main data-testid='page-pet-list' className='ui padded grid'>
            {httpError instanceof HttpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <div className='row'>
                <h1 className='ui huge dividing header'>List Pets</h1>
            </div>
            {petList && petList._links.create ? (
                <div className='row'>
                    <Button as={Link} to='/pet/create' className='green'>Create</Button>
                </div>
            ) : ''}
            {petList ? (
                <div className='row'>
                    <div className='ui attached segment'>
                        <PetFilterForm submitPetFilter={submitPetFilter} filters={filters} error={httpError instanceof BadRequest ? httpError : undefined} />
                    </div>
                </div>
            ) : ''}
            {petList ? (
                <div className='row'>
                    <table className='ui single line striped selectable table'>
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
                                    <td>
                                        {pet._links.read ? (
                                            <Button as={Link} to={`/pet/${pet.id}`}>Read</Button>
                                        ) : ''}
                                        {pet._links.update ? (
                                            <Button as={Link} to={`/pet/${pet.id}/update`}>Update</Button>
                                        ) : ''}
                                        {pet._links.delete ? (
                                            <Button data-testid={`remove-pet-${i}`} onClick={() => { deletePet(pet.id); }} className='red'>Delete</Button>
                                        ) : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination defaultActivePage={page} totalPages={Math.ceil(petList.count / petList.limit)} onPageChange={changePage} />
                </div>
            ) : ''}
        </main>
    );
};

export default List;
