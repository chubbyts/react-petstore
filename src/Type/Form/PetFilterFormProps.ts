import BadRequest from "../Error/BadRequest";
import PetFilters from "../Pet/PetFilters";

type PetFilterFormProps = {
    submitPetFilter: { (filters: PetFilters): void; },
    filters?: any,
    error?: BadRequest
};

export default PetFilterFormProps;
