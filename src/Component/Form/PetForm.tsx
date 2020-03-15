import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { FieldArray as FinalFormFieldArray } from 'react-final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FieldArrayRenderProps from '../../Type/Form/FieldArrayRenderProps';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import Pet from '../../Type/Pet/Pet';
import TextInput from './TextInput';
import UnprocessableEntity from '../../Type/Error/UnprocessableEntity';
import FormField from './FormField';

type props = {
    submitPet: { (pet: Pet): any; },
    pet?: Pet,
    error?: UnprocessableEntity
};

const PetForm = ({ submitPet, pet, error }: props) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

    return (
        <FinalForm
            onSubmit={async (pet: Pet) => await submitPet(pet)}
            initialValues={pet}
            mutators={{
                ...arrayMutators
            }}
            render={({
                handleSubmit,
                form: {
                    mutators: { push }
                },
                form
            }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormField name='name' label='Name' component={TextInput} invalidParameters={invalidParameterByNameDenormalized.name ?? []} />
                        <Form.Field>
                            <label>Vaccination</label>
                            <FinalFormFieldArray name='vaccinations'>
                                {({ fields }: FieldArrayRenderProps) =>
                                    fields.map((name: string, i: number) => (
                                        <div key={i} className='ui bottom attached segment'>
                                            <FormField name={`${name}.name`} label='Name' component={TextInput} invalidParameters={invalidParameterByNameDenormalized[`${name}.name`] ?? []} />
                                            <Form.Field>
                                                <button type='button' className='ui button red' onClick={() => fields.remove(i)}>Remove</button>
                                            </Form.Field>
                                        </div>
                                    ))
                                }
                            </FinalFormFieldArray>
                            <button type='button' className='ui button green' onClick={() => push('vaccinations', undefined)}>Add</button>
                        </Form.Field>
                        <Button onClick={form.submit} className='blue'>Submit</Button>
                    </Form>
                )}
        />
    );
};

export default PetForm;
