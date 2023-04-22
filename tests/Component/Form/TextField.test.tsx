import { render } from '@testing-library/react';
import TextField from '../../../src/Component/Form/TextField';
import InvalidParameter from '../../../src/Model/Error/InvalidParameter';
import { UseFormRegister } from 'react-hook-form';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';

test('default', () => {
  const register = ((name: string) => ({ name })) as UseFormRegister<any>;

  const invalidParameters: Array<InvalidParameter> = [{ name: 'name', reason: 'Should not be empty' }];

  const { container } = render(
    <TextField register={register} name="name" label="label" invalidParameters={invalidParameters} />,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class=\\"form-field error\\">
        <label>label</label><input type=\\"text\\" name=\\"name\\" value=\\"\\" />
        <ul>
          <li>Should not be empty</li>
        </ul>
      </div>
    </div>
    "
  `);
});
