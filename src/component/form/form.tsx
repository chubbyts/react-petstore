import type { FC, ReactNode } from 'react';
import type { InvalidParameter } from '../../client/error';
import { cx } from '../class-names';

export const inputClasses = (hasError: boolean): string =>
  cx(
    'min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus',
    hasError ? 'border-danger-field-line bg-danger-field' : 'border-line-control bg-canvas',
  );

export const labelClasses = 'text-sm font-semibold';

export const FieldErrors: FC<{ id: string; invalidParameters: Array<InvalidParameter> }> = ({
  id,
  invalidParameters,
}: {
  id: string;
  invalidParameters: Array<InvalidParameter>;
}) => {
  if (invalidParameters.length === 0) {
    return null;
  }

  return (
    <ul id={id} className="text-danger m-0 list-none p-0 text-[13px]">
      {invalidParameters.map((invalidParameter) => (
        <li key={`${invalidParameter.name}-${invalidParameter.reason}`}>{invalidParameter.reason}</li>
      ))}
    </ul>
  );
};

export type TextFieldProps = {
  'data-testid'?: string;
  id: string;
  label: ReactNode;
  value: string;
  setValue: (value: string) => void;
  invalidParameters: Array<InvalidParameter>;
  placeholder?: string;
  required?: boolean;
};

export const TextField: FC<TextFieldProps> = ({
  'data-testid': dataTestId,
  id,
  label,
  value,
  setValue,
  invalidParameters,
  placeholder,
  required,
}: TextFieldProps) => {
  const hasError = invalidParameters.length > 0;
  const errorId = `${id}-errors`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        data-testid={dataTestId}
        id={id}
        type="text"
        className={cx('h-11', inputClasses(hasError))}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FieldErrors id={errorId} invalidParameters={invalidParameters} />
    </div>
  );
};
