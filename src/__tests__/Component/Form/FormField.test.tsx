import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import { render } from '@testing-library/react';
import FormField from '../../../Component/Form/FormField';
import TextInput from '../../../Component/Form/TextInput';
import InvalidParameter from '../../../Type/Error/InvalidParameter';

test('default', () => {
    const component = TextInput;

    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'Should not be empty' }
    ];

    const { container } = render(
        <FinalForm
            onSubmit={() => { }}
            render={() => (
                <FormField name='name' label='label' component={component} invalidParameters={invalidParameters} />
            )}
        />
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div class="field error">
                <label>label</label>
                <input type="text" name="name" value="">
                <div class="ui pointing red basic label">Should not be empty</div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});
