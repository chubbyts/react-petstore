import Pet from "../Pet/Pet";
import UnprocessableEntity from "../Error/UnprocessableEntity";

type PetFormProps = {
    submitPet: { (pet: Pet): any; },
    pet?: Pet,
    error?: UnprocessableEntity
};

export default PetFormProps;
