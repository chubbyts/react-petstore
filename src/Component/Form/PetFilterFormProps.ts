import BadRequest from '../../Model/Error/BadRequest';
import PetFilters from '../../Model/Pet/PetFilters';

type PetFilterFormProps = {
    submitPetFilter: { (filters: PetFilters): void; },
    defaultPetFilters?: PetFilters,
    badRequest?: BadRequest
};

export default PetFilterFormProps;
