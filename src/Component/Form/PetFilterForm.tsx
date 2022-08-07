import { FC } from 'react';
import { useForm } from 'react-hook-form';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import { PetFilters } from '../../Model/model';
import PetFilterFormProps from './PetFilterFormProps';
import TextField from './TextField';

const PetFilterForm: FC<PetFilterFormProps> = ({
  submitPetFilter,
  defaultPetFilters: filters,
  badRequest: error,
}: PetFilterFormProps) => {
  const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

  const { register, handleSubmit } = useForm<PetFilters>({ defaultValues: filters });

  const onSubmit = (petFilters: PetFilters) => {
    if ('' === petFilters.name) {
      petFilters.name = undefined;
    }

    submitPetFilter(petFilters);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <TextField
          register={register}
          name="name"
          label="Name"
          invalidParameters={invalidParameterByNameDenormalized.get('name') ?? []}
        />
        <button data-testid="submit-pet-filter" className="btn-blue">
          Filter
        </button>
      </fieldset>
    </form>
  );
};

export default PetFilterForm;
