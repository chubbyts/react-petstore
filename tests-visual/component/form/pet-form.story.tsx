import type { FC } from 'react';
import { UnprocessableEntity } from '../../../src/client/error';
import { Meta } from '../../../src/component/card';
import { PetForm } from '../../../src/component/form/pet-form';

const noop = () => {};

export const PetFormStory: FC = () => (
  <div className="flex w-[880px] flex-col gap-6">
    <PetForm submitPet={noop} submitLabel="Create pet" cancelTo="/pet" listTo="/pet" />
    <PetForm
      initialPet={{ name: 'Brownie', tag: 'dog', vaccinations: [{ name: 'Rabies' }, { name: 'Distemper' }] }}
      submitPet={noop}
      submitLabel="Save changes"
      cancelTo="/pet/4d783b77-eb09-4603-b99b-f590b605ea00"
      listTo="/pet"
      meta={
        <Meta
          id="4d783b77-eb09-4603-b99b-f590b605ea00"
          createdAt="2026-11-01T08:14:00+00:00"
          updatedAt="2026-11-20T16:45:00+00:00"
        />
      }
      isPending
    />
  </div>
);

// the first invalid field gets the focus: one form per story
export const PetFormErrorsStory: FC = () => (
  <div className="w-[880px]">
    <PetForm
      initialPet={{ name: '', tag: 'dog', vaccinations: [{ name: '' }] }}
      httpError={
        new UnprocessableEntity({
          title: 'Unprocessable Entity',
          invalidParameters: [
            { name: 'name', reason: 'Should not be blank' },
            { name: 'vaccinations[0][name]', reason: 'Should not be blank' },
          ],
        })
      }
      submitPet={noop}
      submitLabel="Create pet"
      cancelTo="/pet"
      listTo="/pet"
    />
  </div>
);
