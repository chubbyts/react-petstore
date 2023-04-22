import { FC } from 'react';
import { useForm } from 'react-hook-form';
import InvalidParameterByNameDenormalizer from '../../denormalizer/invalid-parameter-by-name-denormalizer';
import { PetFilters } from '../../model/model';
import { TextField } from './text-field';
import { BadRequest } from '../../api-client/error';

export type PetFilterFormProps = {
  submitPetFilter: { (filters: PetFilters): void };
  defaultPetFilters?: PetFilters;
  badRequest?: BadRequest;
};

export const PetFilterForm: FC<PetFilterFormProps> = ({
  submitPetFilter,
  defaultPetFilters,
  badRequest,
}: PetFilterFormProps) => {
  const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(
    badRequest ? badRequest.invalidParameters : [],
  );

  const { register, handleSubmit } = useForm<PetFilters>({ defaultValues: defaultPetFilters });

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
