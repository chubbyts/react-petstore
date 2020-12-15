import { FC, useState, useEffect } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { Link, RouteComponentProps } from 'react-router-dom';
import { ReadPet } from '../../../ApiClient/Pet';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetResponse from '../../../Model/Pet/PetResponse';

type Props = RouteComponentProps<{ id: string; }>;

const Read: FC<Props> = ({ match }: Props) => {

    const id = match.params.id;

    const [pet, setPet] = useState<PetResponse>();
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
        return (<div></div>);
    }

    return (
        <div data-testid='page-pet-read'>
            {httpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <h1>Read Pet</h1>
            {pet ? (
                <div>
                    <dl>
                        <dt>Id</dt>
                        <dd>{pet.id}</dd>
                        <dt>CreatedAt</dt>
                        <dd>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</dd>
                        <dt>UpdatedAt</dt>
                        <dd>{pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</dd>
                        <dt>Name</dt>
                        <dd>{pet.name}</dd>
                        <dt>Tag</dt>
                        <dd>{pet.tag}</dd>
                        <dt>Vaccinations</dt>
                        <dd>
                            {pet.vaccinations.length > 0 ? (
                                <ul>{pet.vaccinations.map((vaccination, i) => (<li key={i}>{vaccination.name}</li>))}</ul>
                            ) : ''}
                        </dd>
                    </dl>
                    <Link to='/pet' className='btn-gray'>List</Link>
                </div>
            ) : ''}

        </div>
    );
};

export default Read;
