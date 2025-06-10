import { useState, type FC } from 'react';
import type { InvalidParameter } from '../../client/error';

export const FieldSet: FC<
  React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>
> = (props: React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>) => {
  return (
    <fieldset {...props} className={`mb-3 border border-gray-300 px-4 py-3 ${props.className ?? ''}`}>
      {props.children}
    </fieldset>
  );
};

export type TextFieldProps = {
  'data-testid'?: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
  invalidParameters: Array<InvalidParameter>;
};

export const TextField: FC<TextFieldProps> = ({
  'data-testid': dataTestId,
  label,
  value,
  setValue,
  invalidParameters,
}: TextFieldProps) => {
  const [internalValue, setInternalValue] = useState<string>(value);

  return (
    <label className={`block ${invalidParameters.length > 0 ? 'text-red-600' : ''} `}>
      {label}
      <input
        data-testid={dataTestId}
        type="text"
        className={`mt-2 mb-3 block w-full border px-3 py-2 ${
          invalidParameters.length > 0 ? 'border-red-600 bg-red-100' : 'border-gray-300'
        }`}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={() => {
          setValue(internalValue);
        }}
        onKeyDown={(e) => {
          if (e.code !== 'Enter') {
            return;
          }

          setValue(internalValue);
        }}
        value={internalValue}
      />
      {invalidParameters.length > 0 ? (
        <ul className="mb-3">
          {invalidParameters.map((invalidParameter, i) => (
            <li key={i}>{invalidParameter.reason}</li>
          ))}
        </ul>
      ) : null}
    </label>
  );
};
