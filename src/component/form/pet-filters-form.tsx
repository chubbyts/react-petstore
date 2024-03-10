import { useMemo, type FC } from 'react';
import type { PetFilters } from '../../../model/pet';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { FieldSet, TextField } from './form';
import { Button } from '../button';
import { useStore } from '../../hook/use-store';

export type PetFiltersFormProps = {
  httpError?: HttpError;
  initialPetFilters: PetFilters;
  submitPetFilters: { (filters: PetFilters): void };
};

export const PetFiltersForm: FC<PetFiltersFormProps> = ({
  httpError,
  initialPetFilters,
  submitPetFilters,
}: PetFiltersFormProps) => {
  const groupInvalidParametersByName = useMemo(() => createInvalidParametersByName(httpError), [httpError]);

  const [petFilters, setPetFilters] = useStore<PetFilters>(initialPetFilters);

  const onSubmit = () => {
    submitPetFilters({ ...petFilters });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit();
      }}
    >
      <FieldSet>
        <TextField
          data-testid="pet-filters-form-name"
          label="Name"
          value={petFilters.name ?? ''}
          setValue={(value) => setPetFilters('name', value === '' ? undefined : value)}
          invalidParameters={groupInvalidParametersByName.get('filters[name]') ?? []}
        />
        <Button data-testid="pet-filters-form-submit" colorTheme="blue">
          Filter
        </Button>
      </FieldSet>
    </form>
  );
};
