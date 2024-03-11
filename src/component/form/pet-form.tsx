import { useMemo, type FC, useEffect } from 'react';
import { FieldSet, TextField } from './form';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { Button } from '../button';
import { useStore } from '../../hook/use-store';
import type { PetRequest } from '../../model/pet';

export type PetFormProps = {
  httpError?: HttpError;
  initialPet?: PetRequest;
  submitPet: (pet: PetRequest) => void;
};

export const PetForm: FC<PetFormProps> = ({ submitPet, initialPet, httpError }: PetFormProps) => {
  const groupInvalidParametersByName = useMemo(() => createInvalidParametersByName(httpError), [httpError]);

  const [pet, setPet, setPetValueByName] = useStore<PetRequest>({ name: '', vaccinations: [] });

  const onSubmit = () => {
    submitPet({ ...pet });
  };

  useEffect(() => {
    if (initialPet) {
      setPet(initialPet);
    }
  }, [initialPet]);

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
          data-testid="pet-form-name"
          label="Name"
          value={pet.name}
          setValue={(value) => setPetValueByName('name', value)}
          invalidParameters={groupInvalidParametersByName.get('name') ?? []}
        />
        <TextField
          data-testid="pet-form-tag"
          label="Tag"
          value={pet.tag ?? ''}
          setValue={(value) => setPetValueByName('tag', value === '' ? undefined : value)}
          invalidParameters={groupInvalidParametersByName.get('tag') ?? []}
        />
        <div className="mb-3">
          <div className="mb-2 block">Vaccinations</div>
          <div>
            {pet.vaccinations.map((vaccination, i) => {
              return (
                <FieldSet key={i}>
                  <TextField
                    data-testid={`pet-form-vaccinations-${i}-name`}
                    label="Name"
                    value={vaccination.name}
                    setValue={(value) =>
                      setPetValueByName('vaccinations', [
                        ...pet.vaccinations.map((currentVaccination, y) => {
                          if (y === i) {
                            return { ...currentVaccination, name: value };
                          }

                          return currentVaccination;
                        }),
                      ])
                    }
                    invalidParameters={groupInvalidParametersByName.get(`vaccinations[${i}][name]`) ?? []}
                  />
                  <Button
                    data-testid={`pet-form-remove-vaccination-${i}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setPetValueByName('vaccinations', [...pet.vaccinations.filter((_, y) => y !== i)]);
                    }}
                    colorTheme="red"
                  >
                    Remove
                  </Button>
                </FieldSet>
              );
            })}
            <Button
              data-testid={'pet-form-add-vaccination'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setPetValueByName('vaccinations', [...pet.vaccinations, { name: '' }]);
              }}
              colorTheme="green"
            >
              Add
            </Button>
          </div>
        </div>
        <Button data-testid="pet-form-submit" colorTheme="blue">
          Save
        </Button>
      </FieldSet>
    </form>
  );
};
