import PetRequest from '../../Model/Pet/PetRequest';
import PetResponse from '../../Model/Pet/PetResponse';
import UnprocessableEntity from '../../Model/Error/UnprocessableEntity';

type PetFormProps = {
    submitPet: { (pet: PetRequest): void; },
    defaultPet?: PetResponse,
    unprocessableEntity?: UnprocessableEntity
};

export default PetFormProps;
