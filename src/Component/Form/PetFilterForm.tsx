import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Form as FinalForm } from 'react-final-form';
import BadRequest from '../../Type/Error/BadRequest';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import TextInput from './TextInput';
import FormField from './FormField';

type Props = {
    submitPetFilter: { (filters: any): any; },
    filters?: any,
    error?: BadRequest
};

const PetFilterForm: React.FC<Props> = ({ submitPetFilter, filters, error }: Props) => {
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
