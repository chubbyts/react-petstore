import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import FormField from './FormField';
import PetFilterFormProps from '../../Type/Form/PetFilterFormProps';
import { useForm } from 'react-hook-form';

const PetFilterForm: React.FC<PetFilterFormProps> = ({ submitPetFilter, filters, error }: PetFilterFormProps) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

    const { register, handleSubmit } = useForm({ defaultValues: filters });

    const onSubmit = async (data: any) => {
        Object.keys(data).forEach(key => {
            data[key] = data[key] !== '' ? data[key] : undefined;
        });

        submitPetFilter(data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group inline>
                <FormField register={register} name='name' label='Name' invalidParameters={invalidParameterByNameDenormalized.name ?? []} />
                <Button data-testid="submit-pet-filter" className='blue'>Filter</Button>
            </Form.Group>
        </Form>
    );
};

export default PetFilterForm;
