import HttpErrorWithInvalidParameters from '../../Model/Error/HttpErrorWithInvalidParameters';
import { PetRequest, PetResponse } from '../../Model/model';

type PetFormProps = {
  submitPet: { (pet: PetRequest): void };
  defaultPet?: PetResponse;
  error?: HttpErrorWithInvalidParameters;
};

export default PetFormProps;
