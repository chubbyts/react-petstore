import BadRequest from "../../Model/Error/BadRequest";
import PetFilters from "../../Model/Pet/PetFilters";

type PetFilterFormProps = {
    submitPetFilter: { (filters: PetFilters): void; },
    filters?: any,
    error?: BadRequest
};

export default PetFilterFormProps;
