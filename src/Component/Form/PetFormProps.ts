import PetRequest from '../../Model/Pet/PetRequest';
import PetResponse from '../../Model/Pet/PetResponse';
import HttpErrorWithInvalidParameters from '../../Model/Error/HttpErrorWithInvalidParameters';

type PetFormProps = {
  submitPet: { (pet: PetRequest): void };
  defaultPet?: PetResponse;
  error?: HttpErrorWithInvalidParameters;
};

export default PetFormProps;
