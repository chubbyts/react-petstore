import BadRequest from '../../Model/Error/BadRequest';
import { PetFilters } from '../../Model/model';

type PetFilterFormProps = {
  submitPetFilter: { (filters: PetFilters): void };
  defaultPetFilters?: PetFilters;
  badRequest?: BadRequest;
};

export default PetFilterFormProps;
