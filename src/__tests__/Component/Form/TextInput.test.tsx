import React from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';
import { render } from '@testing-library/react';
import TextInput from '../../../Component/Form/TextInput';

test('default', () => {
    const input: FieldInputProps<string, HTMLElement> = {
        name: 'name',
        value: 'value',
        onBlur: () => { },
        onChange: () => { },
        onFocus: () => { }
    };

    const meta: FieldMetaState<any> = {
        active: true
    };

    const { container } = render(
        <TextInput input={input} meta={meta} data-id='id' />
    );

    expect(container.outerHTML).toBe(`
        <div><input type="text" name="name" data-id="id" value="value"></div>
    `.replace(/\n {2,}/g, ''));
});
