import type { FC } from 'react';
import { FieldErrors, TextField } from '../../../src/component/form/form';

const noop = () => {};

export const FormStory: FC = () => (
  <div className="flex w-[400px] flex-col gap-4">
    <TextField id="empty" label="Empty" value="" setValue={noop} invalidParameters={[]} />
    <TextField
      id="placeholder"
      label="Placeholder"
      placeholder="e.g. dog, cat"
      value=""
      setValue={noop}
      invalidParameters={[]}
    />
    <TextField id="value" label="Value" value="Brownie" setValue={noop} invalidParameters={[]} required />
    <TextField
      id="errors"
      label="Errors"
      value=""
      setValue={noop}
      invalidParameters={[
        { name: 'name', reason: 'Should not be blank' },
        { name: 'name', reason: 'Should be at least 2 characters' },
      ]}
    />
    <FieldErrors id="field-errors" invalidParameters={[{ name: 'vaccinations', reason: 'Too many vaccinations' }]} />
  </div>
);
