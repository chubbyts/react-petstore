import { FC, useState, useEffect } from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { ReadPet, UpdatePet } from '../../../ApiClient/Pet';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../Partial/HttpError';
import PetResponse from '../../../Model/Pet/PetResponse';
import PetForm from '../../Form/PetForm';
import UnprocessableEntity from '../../../Model/Error/UnprocessableEntity';
import PetRequest from '../../../Model/Pet/PetRequest';

type Props = RouteComponentProps<{ id: string; }>;

const Update: FC<Props> = ({ match }: Props) => {

    const id = match.params.id;

    const history = useHistory();

    const [pet, setPet] = useState<PetResponse>();
    const [httpError, setHttpError] = useState<HttpError>();

    useEffect(() => {
        fetchPet(id);

        document.title = 'Update Pet';
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

    const submitPet = async (pet: PetRequest) => {
        const response = await UpdatePet(id, pet);

        if (response instanceof HttpError) {
            setHttpError(response);
        } else {
            setHttpError(undefined);
            setPet(response);

            history.push('/pet');
        }
    };

    if (!pet && !httpError) {
        return (<div></div>);
    }

    return (
        <div data-testid='page-pet-update'>
            {httpError ? (
                <HttpErrorPartial httpError={httpError} />
            ) : ''}
            <h1>Update Pet</h1>
            {pet ? (
                <PetForm submitPet={submitPet} defaultPet={pet} unprocessableEntity={httpError instanceof UnprocessableEntity ? httpError : undefined} />
            ) : ''}
            <Link to='/pet' className='btn-gray'>List</Link>
        </div>
    );
};

export default Update;

