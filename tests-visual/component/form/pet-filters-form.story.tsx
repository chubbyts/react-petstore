import type { FC } from 'react';
import { BadRequest } from '../../../src/client/error';
import { PetFiltersForm } from '../../../src/component/form/pet-filters-form';

const noop = () => {};

const httpError = new BadRequest({
  title: 'Bad Request',
  invalidParameters: [{ name: 'filters[name]', reason: 'Should be at most 100 characters' }],
});

export const PetFiltersFormStory: FC = () => (
  <div className="flex w-[400px] flex-col gap-4">
    <PetFiltersForm initialPetFilters={{}} submitPetFilters={noop} />
    <PetFiltersForm initialPetFilters={{ name: 'Brownie' }} submitPetFilters={noop} />
    <PetFiltersForm initialPetFilters={{ name: 'B'.repeat(30) }} submitPetFilters={noop} httpError={httpError} />
  </div>
);
