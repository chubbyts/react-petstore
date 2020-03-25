import PetRequest from "../Pet/PetRequest";
import PetResponse from "../Pet/PetResponse";
import UnprocessableEntity from "../Error/UnprocessableEntity";

type PetFormProps = {
    submitPet: { (pet: PetRequest): any; },
    pet?: PetResponse,
    error?: UnprocessableEntity
};

export default PetFormProps;
