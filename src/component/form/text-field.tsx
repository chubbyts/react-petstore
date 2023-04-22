import { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { InvalidParameter } from '../../api-client/error';

type TextFieldProps = {
  register: UseFormRegister<any>;
  name: string;
  label: string;
  defaultValue?: string;
  invalidParameters: Array<InvalidParameter>;
};

export const TextField: FC<TextFieldProps> = ({
  register,
  name,
  label,
  defaultValue,
  invalidParameters,
}: TextFieldProps) => {
  return (
    <div className={`form-field${invalidParameters.length > 0 ? ' error' : ''}`}>
      <label>{label}</label>
      <input type="text" defaultValue={defaultValue} {...register(name)} />
      {invalidParameters.length > 0 ? (
        <ul>
          {invalidParameters.map((invalidParameter: InvalidParameter, i) => (
            <li key={i}>{invalidParameter.reason}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
