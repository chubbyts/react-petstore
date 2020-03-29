import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm, useFieldArray } from 'react-hook-form';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import PetFormProps from './PetFormProps';
import PetRequest from '../../Model/Pet/PetRequest';
import TextField from './TextField';

const PetForm: React.FC<PetFormProps> = ({ submitPet, pet, error }: PetFormProps) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

    const { register, control, handleSubmit } = useForm<PetRequest>({ defaultValues: pet });

    const vaccinations = useFieldArray({ control, name: 'vaccinations'});

    return (
        <Form onSubmit={handleSubmit(submitPet)}>
            <TextField register={register} name='name' label='Name' invalidParameters={invalidParameterByNameDenormalized.name ?? []} />
            <Form.Field>
                <label>Vaccination</label>
                {vaccinations.fields.map((vaccination, i) => {
                    return (
                        <div key={vaccination.id} className='ui bottom attached segment'>
                            <TextField register={register} name={`vaccinations[${i}].name`} label='Name' invalidParameters={invalidParameterByNameDenormalized[`vaccinations[${i}].name`] ?? []} />
                            <Form.Field>
                                <button data-testid={`remove-vaccination-${i}`} type='button' className='ui button red' onClick={() => vaccinations.remove(i)}>Remove</button>
                            </Form.Field>
                        </div>
                    );
                })}
                <button data-testid='add-vaccination' type='button' className='ui button green' onClick={() => vaccinations.append({})}>Add</button>
            </Form.Field>
            <Button data-testid="submit-pet" className='blue'>Submit</Button>
        </Form>
    );
};

export default PetForm;
