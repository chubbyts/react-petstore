import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import PetFilterFormProps from './PetFilterFormProps';
import PetFilters from '../../Model/Pet/PetFilters';
import TextField from './TextField';

const PetFilterForm: React.FC<PetFilterFormProps> = ({ submitPetFilter, filters, error }: PetFilterFormProps) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

    const { register, handleSubmit } = useForm<PetFilters>({ defaultValues: filters });

    const onSubmit = (filters: PetFilters) => {
        if ('' === filters.name) {
            filters.name = undefined;
        }

        submitPetFilter(filters);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group inline>
                <TextField register={register} name='name' label='Name' invalidParameters={invalidParameterByNameDenormalized.name ?? []} />
                <Button data-testid="submit-pet-filter" className='blue'>Filter</Button>
            </Form.Group>
        </Form>
    );
};

export default PetFilterForm;
