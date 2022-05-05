import { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import InvalidParameter from '../../Model/Error/InvalidParameter';

type Props = {
  register: UseFormRegister<any>;
  name: string;
  label: string;
  defaultValue?: string;
  invalidParameters: Array<InvalidParameter>;
};

const TextField: FC<Props> = ({ register, name, label, defaultValue, invalidParameters }: Props) => {
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

export default TextField;
