import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Form as FinalForm } from 'react-final-form';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import TextInput from './TextInput';
import FormField from './FormField';
import PetFilterFormProps from '../../Type/Form/PetFilterFormProps';

const PetFilterForm: React.FC<PetFilterFormProps> = ({ submitPetFilter, filters, error }: PetFilterFormProps) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

    return (
        <FinalForm
            onSubmit={submitPetFilter}
            initialValues={filters}
            render={({ handleSubmit, form }) => (
                <Form onSubmit={handleSubmit}>
                    <Form.Group inline>
                        <FormField name='name' label='Name' component={TextInput} invalidParameters={invalidParameterByNameDenormalized.name ?? []} />
                        <Button data-testid="submit-pet-filter" onClick={form.submit} className='blue'>Filter</Button>
                    </Form.Group>
                </Form>
            )} />
    );
};

export default PetFilterForm;
