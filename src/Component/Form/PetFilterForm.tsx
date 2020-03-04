import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Form as FinalForm, Field as FinalFormField } from 'react-final-form';
import BadRequest from '../../Type/Error/BadRequest';
import InvalidParameter from '../../Type/Error/InvalidParameter';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import TextInput from './TextInput';

const PetFilterForm = ({ submitPetFilter, filters, error }: { submitPetFilter: { (filters: any): any; }; filters?: any; error?: BadRequest }) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

    return (
        <FinalForm
            onSubmit={submitPetFilter}
            initialValues={filters}
            render={({ handleSubmit, form }) => (
                <Form onSubmit={handleSubmit}>
                    <Form.Group inline>
                        <Form.Field className={invalidParameterByNameDenormalized.name && ' error'}>
                            <label>Name</label>
                            <FinalFormField<string>
                                name='name'
                                component={TextInput}
                            />
                            {invalidParameterByNameDenormalized.name && invalidParameterByNameDenormalized.name.map((invalidParameter: InvalidParameter, i) => (
                                <div key={i} className='ui pointing red basic label'>{invalidParameter.reason}</div>
                            ))}
                        </Form.Field>
                        <Button onClick={form.submit} className='blue'>Filter</Button>
                    </Form.Group>
                </Form>
            )} />
    );
};

export default PetFilterForm;
