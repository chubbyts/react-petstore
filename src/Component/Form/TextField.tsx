import { FC } from 'react';
import InvalidParameter from '../../Model/Error/InvalidParameter';

type Props = {
    register: any,
    name: string,
    label: string,
    invalidParameters: Array<InvalidParameter>
};

const TextField: FC<Props> = ({ register, name, label, invalidParameters }: Props) => {
    return (
        <div className={`form-field${invalidParameters.length > 0 ? ' error' : ''}`}>
            <label>{label}</label>
            <input type='text' name={name} ref={register()} />
            {invalidParameters.length > 0 ? (
                <ul>
                    {invalidParameters.map((invalidParameter: InvalidParameter, i) => (
                        <li key={i}>{invalidParameter.reason}</li>
                    ))}
                </ul>
            ) : ''}
        </div>
    );
};

export default TextField;
