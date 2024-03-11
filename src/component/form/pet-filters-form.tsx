import { useMemo, type FC, useEffect } from 'react';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { FieldSet, TextField } from './form';
import { Button } from '../button';
import { useStore } from '../../hook/use-store';
import type { PetFilters } from '../../model/pet';

export type PetFiltersFormProps = {
  httpError?: HttpError;
  initialPetFilters: PetFilters;
  submitPetFilters: (filters: PetFilters) => void;
};

export const PetFiltersForm: FC<PetFiltersFormProps> = ({
  httpError,
  initialPetFilters,
  submitPetFilters,
}: PetFiltersFormProps) => {
  const groupInvalidParametersByName = useMemo(() => createInvalidParametersByName(httpError), [httpError]);

  const [petFilters, setPetFilters, setPetFilterValueByName] = useStore<PetFilters>(initialPetFilters);

  const onSubmit = () => {
    submitPetFilters({ ...petFilters });
  };

  useEffect(() => {
    setPetFilters(initialPetFilters);
  }, [initialPetFilters]);

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
          setValue={(value) => setPetFilterValueByName('name', value === '' ? undefined : value)}
          invalidParameters={groupInvalidParametersByName.get('filters[name]') ?? []}
        />
        <Button data-testid="pet-filters-form-submit" colorTheme="blue">
          Filter
        </Button>
      </FieldSet>
    </form>
  );
};
