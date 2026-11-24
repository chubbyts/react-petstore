import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { cx } from '../class-names';
import { SearchIcon } from '../icon';
import type { PetFilters } from '../../model/pet';
import { FieldErrors, inputClasses } from './form';

// filters while typing, once there was no keystroke for this long (ms): not a request per character
export const filterDelay = 300;

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
  const invalidParameters = groupInvalidParametersByName.get('filters[name]') ?? [];

  const initialName = initialPetFilters.name ?? '';
  const [name, setName] = useState<string>(initialName);

  // the last name submitted from here (or received from outside)
  const submittedName = useRef<string>(initialName);

  // follow outer changes (e.g. "Clear filter"), but not the ones submitted from here: would undo the typing since
  useEffect(() => {
    if (initialName === submittedName.current) {
      return;
    }

    // oxlint-disable-next-line functional/immutable-data
    submittedName.current = initialName;
    // oxlint-disable-next-line react/set-state-in-effect
    setName(initialName);
  }, [initialName]);

  const submit = (value: string) => {
    if (value === submittedName.current) {
      return;
    }

    // oxlint-disable-next-line functional/immutable-data
    submittedName.current = value;
    submitPetFilters({ ...initialPetFilters, name: value === '' ? undefined : value });
  };

  // the latest submit (current filters, sort, page), without restarting the delay on every render
  const submitRef = useRef(submit);

  useEffect(() => {
    // oxlint-disable-next-line functional/immutable-data
    submitRef.current = submit;
  });

  // restarts the delay on typing only: other renders (e.g. a refetch) don't postpone the filtering
  useEffect(() => {
    const timeout = setTimeout(() => submitRef.current(name), filterDelay);

    return () => clearTimeout(timeout);
  }, [name]);

  return (
    <form
      role="search"
      className="flex flex-[1_1_260px] flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        submit(name);
      }}
    >
      <label className="relative flex items-center">
        <span className="sr-only">Filter by name</span>
        <span className="text-fg-muted pointer-events-none absolute left-3 flex">
          <SearchIcon />
        </span>
        <input
          data-testid="pet-filters-form-name"
          type="search"
          placeholder="Filter by name"
          className={cx('h-10 w-full pr-3 pl-9', inputClasses(invalidParameters.length > 0))}
          aria-invalid={invalidParameters.length > 0 || undefined}
          aria-describedby={cx('pet-filters-name-hint', invalidParameters.length > 0 && 'pet-filters-name-errors')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <span id="pet-filters-name-hint" className="sr-only">
        Results update as you type
      </span>
      <FieldErrors id="pet-filters-name-errors" invalidParameters={invalidParameters} />
    </form>
  );
};
