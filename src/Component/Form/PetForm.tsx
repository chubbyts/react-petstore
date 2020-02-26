import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form as FinalForm, Field as FinalFormField } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray as FinalFormFieldArray } from 'react-final-form-arrays'
import TextInput from './TextInput';
import Pet from '../../Type/Pet/Pet';
import UnprocessableEntity from '../../Type/Error/UnprocessableEntity';
import InvalidParameter from '../../Type/Error/InvalidParameter';
import FieldArrayRenderProps from '../../Type/Form/FieldArrayRenderProps';
import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import { Button, Form } from 'semantic-ui-react';

const PetForm = ({ apiCall, pet }: { apiCall: CallableFunction; pet?: Pet; }) => {

    const history = useHistory();

    const [unprocessableEntity, setUnprocessableEntity] = useState<UnprocessableEntity>();

    const submitPet = async (pet: Pet) => {
        const unprocessableEntity = await apiCall(pet);

        if (!(unprocessableEntity instanceof UnprocessableEntity)) {
            setUnprocessableEntity(undefined);

            history.push('/pet');

            return;
        }

        setUnprocessableEntity(unprocessableEntity);
    };

    const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(unprocessableEntity?.invalidParameters);

    return (
        <FinalForm
            onSubmit={submitPet}
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
                        <Button as={Link} to='/pet'>List</Button>
                    </Form>
                )}
        />
    );
}

export default PetForm;
