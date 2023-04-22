import { render } from '@testing-library/react';
import { HttpError as HttpErrorPartial } from '../../../src/component/partial/http-error';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';
import { HttpError, HttpErrorWithInvalidParameters } from '../../../src/api-client/error';

test('minimal', () => {
  const httpError = new HttpError({
    title: 'This is the title',
  });

  const { container } = render(<HttpErrorPartial httpError={httpError} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div id=\\"httpError\\"><p>This is the title</p></div>
    </div>
    "
  `);
});

test('maximal', () => {
  const httpError = new HttpErrorWithInvalidParameters({
    title: 'This is the title',
    detail: 'This is the detail',
    instance: 'This is the instance',
    invalidParameters: [{ name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason' }],
  });

  const { container } = render(<HttpErrorPartial httpError={httpError} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div id=\\"httpError\\">
        <p>This is the title</p>
        <p>This is the detail</p>
        <p>This is the instance</p>
        <ul>
          <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
        </ul>
      </div>
    </div>
    "
  `);
});
