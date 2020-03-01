import React, { useState, useEffect } from 'react';
import { Button, List } from 'semantic-ui-react';
import { de } from 'date-fns/locale';
import { default as PageNotFound } from '../Error/NotFound';
import { format } from 'date-fns';
import { Link, RouteComponentProps } from 'react-router-dom';
import { ReadPet } from '../../../ApiClient/Pet';
import Empty from '../Empty';
import InternalServerError from '../../../Type/Error/InternalServerError';
import NotFound from '../../../Type/Error/NotFound';
import PageInternalServerError from '../Error/InternalServerError';
import Pet from '../../../Type/Pet/Pet';

const Read = ({ match }: RouteComponentProps<{ id: string; }>) => {

    const id = match.params.id;

    const [pet, setPet] = useState<Pet | NotFound | InternalServerError>();

    useEffect(() => {
        const fetchPet = async () => {
            setPet(await ReadPet(id));
        };

        fetchPet();

        document.title = 'Read Pet';
    }, [id]);

    if (!pet) {
        return (<Empty />);
    }

    if (pet instanceof InternalServerError) {
        return (<PageInternalServerError />);
    }

    if (pet instanceof NotFound) {
        return (<PageNotFound message={`Missing pet: ${id}`} />);
    }

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Read Pet</h1>
            </div>
            <div className='row'>
                <List>
                    <List.Item>
                        <List.Header>Id</List.Header>
                        {pet.id}
                    </List.Item>
                    <List.Item>
                        <List.Header>CreatedAt</List.Header>
                        {format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                    </List.Item>
                    <List.Item>
                        <List.Header>UpdatedAt</List.Header>
                        {pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                    </List.Item>
                    <List.Item>
                        <List.Header>Name</List.Header>
                        {pet.name}
                    </List.Item>
                    <List.Item>
                        <List.Header>Vaccinations</List.Header>
                        <ul>{pet.vaccinations.map((vaccination, i) => (<li key={i}>{vaccination.name}</li>))}</ul>
                    </List.Item>
                </List>
            </div>
            <div className='row'>
                <Button as={Link} to='/pet'>List</Button>
            </div>
        </main>
    );
};

export default Read;
