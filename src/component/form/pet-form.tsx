import { useEffect, useMemo, useRef, type FC, type ReactNode } from 'react';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { AnchorButton, Button } from '../button';
import { cardClasses, CardBody, CardFooter } from '../card';
import { cx } from '../class-names';
import { TrashIcon } from '../icon';
import { BackToList } from '../partial/back-to-list';
import { useStore } from '../../hook/use-store';
import { useListKeys } from '../../hook/use-list-keys';
import type { PetRequest } from '../../model/pet';
import { FieldErrors, inputClasses, labelClasses, TextField } from './form';

export type PetFormProps = {
  httpError?: HttpError;
  initialPet?: PetRequest;
  submitPet: (pet: PetRequest) => void;
  submitLabel: string;
  cancelTo: string;
  listTo: string;
  meta?: ReactNode;
  isPending?: boolean;
};

export const PetForm: FC<PetFormProps> = ({
  submitPet,
  initialPet,
  httpError,
  submitLabel,
  cancelTo,
  listTo,
  meta,
  isPending,
}: PetFormProps) => {
  const groupInvalidParametersByName = useMemo(() => createInvalidParametersByName(httpError), [httpError]);

  const [pet, setPet] = useStore<PetRequest>(initialPet ?? { name: '', vaccinations: [] });

  // errors of a vaccination stay with it when other vaccinations get removed
  const vaccinationKeys = useListKeys(pet.vaccinations.length);

  const formRef = useRef<HTMLFormElement>(null);

  // id of the element to focus after the next render (rows get added / removed)
  const focusAfterRender = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!focusAfterRender.current) {
      return;
    }

    document.getElementById(focusAfterRender.current)?.focus();
    // oxlint-disable-next-line functional/immutable-data
    focusAfterRender.current = undefined;
  });

  // after a failed save, continue at the first invalid field (the summary is announced by its role alert)
  useEffect(() => {
    if (!httpError) {
      return;
    }

    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [httpError]);

  const addVaccination = (): void => {
    // oxlint-disable-next-line functional/immutable-data
    focusAfterRender.current = `pet-vaccination-${pet.vaccinations.length}`;
    vaccinationKeys.add();
    setPet('vaccinations', [...pet.vaccinations, { name: '' }]);
  };

  // the removed row (and its button) is gone: continue at the row now at that place, the previous one or add
  const removeVaccination = (i: number): void => {
    const remaining = pet.vaccinations.length - 1;

    // oxlint-disable-next-line functional/immutable-data
    focusAfterRender.current = remaining > 0 ? `pet-vaccination-${Math.min(i, remaining - 1)}` : 'pet-add-vaccination';
    vaccinationKeys.remove(i);
    setPet(
      'vaccinations',
      pet.vaccinations.filter((_, y) => y !== i),
    );
  };

  const setVaccinationName = (i: number, name: string): void => {
    setPet(
      'vaccinations',
      pet.vaccinations.map((vaccination, y) => (y === i ? { ...vaccination, name } : vaccination)),
    );
  };

  return (
    <form
      ref={formRef}
      className={cardClasses}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        vaccinationKeys.submit();
        submitPet({ ...pet });
      }}
    >
      <CardBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            data-testid="pet-form-name"
            id="pet-name"
            label={
              <>
                Name{' '}
                <span aria-hidden="true" className="text-danger">
                  *
                </span>
              </>
            }
            required
            value={pet.name}
            setValue={(value) => setPet('name', value)}
            invalidParameters={groupInvalidParametersByName.get('name') ?? []}
          />
          <TextField
            data-testid="pet-form-tag"
            id="pet-tag"
            label={
              <>
                Tag <span className="text-fg-muted font-normal">· optional</span>
              </>
            }
            placeholder="e.g. dog, cat"
            value={pet.tag ?? ''}
            setValue={(value) => setPet('tag', value === '' ? undefined : value)}
            invalidParameters={groupInvalidParametersByName.get('tag') ?? []}
          />
        </div>
        <div role="group" aria-labelledby="pet-vaccinations" className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span id="pet-vaccinations" className={labelClasses}>
              Vaccinations <span className="text-fg-muted font-normal">({pet.vaccinations.length})</span>
            </span>
            <Button
              data-testid="pet-form-add-vaccination"
              id="pet-add-vaccination"
              variant="secondary"
              size="sm"
              className="text-sm"
              onClick={addVaccination}
            >
              + Add vaccination
            </Button>
          </div>
          <FieldErrors
            id="pet-vaccinations-errors"
            invalidParameters={groupInvalidParametersByName.get('vaccinations') ?? []}
          />
          {pet.vaccinations.length > 0 ? (
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {pet.vaccinations.map((vaccination, i) => {
                const invalidParameters =
                  groupInvalidParametersByName.get(`vaccinations[${vaccinationKeys.submittedIndex(i)}][name]`) ?? [];
                const errorId = `pet-vaccination-${i}-errors`;

                return (
                  <li key={vaccinationKeys.keys[i]} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        data-testid={`pet-form-vaccinations-${i}-name`}
                        id={`pet-vaccination-${i}`}
                        type="text"
                        aria-label={`Vaccination ${i + 1} name`}
                        aria-invalid={invalidParameters.length > 0 || undefined}
                        aria-describedby={invalidParameters.length > 0 ? errorId : undefined}
                        className={cx('h-10 flex-1', inputClasses(invalidParameters.length > 0))}
                        value={vaccination.name}
                        onChange={(e) => setVaccinationName(i, e.target.value)}
                      />
                      <Button
                        data-testid={`pet-form-remove-vaccination-${i}`}
                        variant="ghost-danger"
                        size="md"
                        className="border-line-control border"
                        aria-label={`Remove vaccination ${i + 1}`}
                        onClick={() => removeVaccination(i)}
                      >
                        <TrashIcon />
                        Remove
                      </Button>
                    </div>
                    <FieldErrors id={errorId} invalidParameters={invalidParameters} />
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="border-line-strong text-fg-muted m-0 rounded-lg border border-dashed p-4 text-center text-sm">
              No vaccinations yet.
            </p>
          )}
        </div>
      </CardBody>
      <CardFooter>
        {meta}
        <span className="flex-1" />
        <BackToList to={listTo} />
        <AnchorButton data-testid="pet-form-cancel" to={cancelTo} variant="secondary">
          Cancel
        </AnchorButton>
        <Button data-testid="pet-form-submit" type="submit" variant="primary" disabled={isPending}>
          {submitLabel}
        </Button>
      </CardFooter>
    </form>
  );
};
