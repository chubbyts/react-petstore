import React, { useState, useEffect } from 'react';
import { Button, List } from 'semantic-ui-react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { Link, RouteComponentProps } from 'react-router-dom';
import { ReadPet } from '../../../ApiClient/Pet';
import Empty from '../Empty';
import HttpError from '../../../Type/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import Pet from '../../../Type/Pet/Pet';

type props = RouteComponentProps<{ id: string; }>;

const Read = ({ match }: props) => {

    const id = match.params.id;

    const [pet, setPet] = useState<Pet>();
    const [httpError, setHttpError] = useState<HttpError>();

    useEffect(() => {
        fetchPet(id);

        document.title = 'Read Pet';
    }, [id]);

    const fetchPet = async (id: string) => {
        const response = await ReadPet(id);

        if (response instanceof HttpError) {
            setHttpError(response);
        } else {
            setHttpError(undefined);
            setPet(response);
        }
    };

    if (!pet && !httpError) {
        return (<Empty />);
    }

    return (
        <main className='ui padded grid'>
            {httpError instanceof HttpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <div className='row'>
                <h1 className='ui huge dividing header'>Read Pet</h1>
            </div>
            {pet ? (
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
            ) : ''}
            <div className='row'>
                <Button as={Link} to='/pet'>List</Button>
            </div>
        </main>
    );
};

export default Read;
