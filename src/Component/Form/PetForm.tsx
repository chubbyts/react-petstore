import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { FieldArray as FinalFormFieldArray } from 'react-final-form-arrays';
import { Form as FinalForm, Field as FinalFormField } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FieldArrayRenderProps from '../../Type/Form/FieldArrayRenderProps';
import InvalidParameter from '../../Type/Error/InvalidParameter';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import Pet from '../../Type/Pet/Pet';
import TextInput from './TextInput';
import UnprocessableEntity from '../../Type/Error/UnprocessableEntity';

const PetForm = ({ submitPet, pet }: { submitPet: { (pet: Pet): any; }; pet?: Pet | UnprocessableEntity; }) => {
    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(pet instanceof UnprocessableEntity ? pet.invalidParameters : []);

    return (
        <FinalForm
            onSubmit={async (pet: Pet) => await submitPet(pet)}
            initialValues={pet instanceof UnprocessableEntity ? undefined : pet}
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
                        <Form.Field>
                            <label>Vaccination</label>
                            <FinalFormFieldArray name='vaccinations'>
                                {({ fields }: FieldArrayRenderProps) =>
                                    fields.map((name: string, i: number) => (
                                        <div key={i} className='ui bottom attached segment'>
                                            <Form.Field className={invalidParameterByNameDenormalized[`${name}.name`] && ' error'}>
                                                <label>Name</label>
                                                <FinalFormField
                                                    name={`${name}.name`}
                                                    component={TextInput}
                                                />
                                                {invalidParameterByNameDenormalized[`${name}.name`] && invalidParameterByNameDenormalized[`${name}.name`].map((invalidParameter: InvalidParameter, i) => (
                                                    <div key={i} className='ui pointing red basic label'>{invalidParameter.reason}</div>
                                                ))}
                                            </Form.Field>
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
