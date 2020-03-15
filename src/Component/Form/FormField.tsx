import React, { FunctionComponent } from 'react';
import { Form } from 'semantic-ui-react';
import { Field as FinalFormField } from 'react-final-form';
import InvalidParameter from '../../Type/Error/InvalidParameter';

import { FieldRenderProps } from 'react-final-form';

type props = {
    name: string,
    label: string,
    component: FunctionComponent<FieldRenderProps<string, HTMLElement>>,
    invalidParameters: Array<InvalidParameter>
};

const FormField = ({ name, label, component, invalidParameters }: props) => {
    return (
        <Form.Field className={invalidParameters.length > 0 ? ' error' : ''}>
            <label>{label}</label>
            <FinalFormField<string>
                name={name}
                component={component}
            />
            {invalidParameters && invalidParameters.map((invalidParameter: InvalidParameter, i) => (
                <div key={i} className='ui pointing red basic label'>{invalidParameter.reason}</div>
            ))}
        </Form.Field>
    );
};

export default FormField;
