import React from 'react';
import { Form } from 'semantic-ui-react';
import InvalidParameter from '../../Type/Error/InvalidParameter';

type Props = {
    register: any,
    name: string,
    label: string,
    invalidParameters: Array<InvalidParameter>
};

const FormField: React.FC<Props> = ({ register, name, label, invalidParameters }: Props) => {
    return (
        <Form.Field className={invalidParameters.length > 0 ? 'error' : ''}>
            <label>{label}</label>
            <input type='text' name={name} ref={register} />
            {invalidParameters && invalidParameters.map((invalidParameter: InvalidParameter, i) => (
                <div key={i} className='ui pointing red basic label'>{invalidParameter.reason}</div>
            ))}
        </Form.Field>
    );
};

export default FormField;
