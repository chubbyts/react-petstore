import BadRequest from '../../Model/Error/BadRequest';
import PetFilters from '../../Model/Pet/PetFilters';

type PetFilterFormProps = {
    submitPetFilter: { (filters: PetFilters): void; },
    filters?: PetFilters,
    error?: BadRequest
};

export default PetFilterFormProps;
