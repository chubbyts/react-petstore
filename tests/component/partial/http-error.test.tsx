import { test, expect, describe } from 'vitest';
import { render } from '@testing-library/react';
import { formatHtml } from '../../formatter';
import { HttpError } from '../../../src/component/partial/http-error';
import {
  BadRequest,
  HttpError as HttpErrorType,
  InternalServerError,
  NetworkError,
  NotFound,
  Unauthorized,
} from '../../../src/client/error';

describe('http-error', () => {
  test('minimal', () => {
    const { container } = render(<HttpError httpError={new NetworkError({ title: 'Failed to fetch' })} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div
          role="alert"
          data-testid="http-error"
          class="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
        >
          <p class="m-0"><strong class="text-danger">Failed to fetch</strong></p>
        </div>
      </div>
      "
    `);
  });

  test('maximal', () => {
    const httpError = new BadRequest({
      title: 'Bad Request',
      detail: 'Sorting value',
      instance: 'instance-1234',
      invalidParameters: [
        { name: 'name', reason: 'Too small' },
        { name: 'vaccinations[0][name]', reason: 'Too small' },
      ],
    });

    const { container } = render(<HttpError httpError={httpError} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div
          role="alert"
          data-testid="http-error"
          class="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
        >
          <p class="m-0"><strong class="text-danger">400 Bad Request</strong></p>
          <p class="m-0">Sorting value</p>
          <p class="m-0 font-mono text-[13px]">instance-1234</p>
          <ul class="m-0 list-none p-0">
            <li>
              <strong class="text-danger font-semibold">name</strong>: Too small
            </li>
            <li>
              <strong class="text-danger font-semibold">vaccinations[0][name]</strong
              >: Too small
            </li>
          </ul>
        </div>
      </div>
      "
    `);
  });

  test.each([
    [new Unauthorized({ title: 'Unauthorized' }), '401 Unauthorized'],
    [new NotFound({ title: 'Not Found' }), '404 Not Found'],
    [new InternalServerError({ title: 'Internal Server Error' }), '500 Internal Server Error'],
    [new HttpErrorType({ title: 'Authentication failed' }), 'Authentication failed'],
  ])('status of %o', (httpError, text) => {
    const { container } = render(<HttpError httpError={httpError} />);

    expect(container.textContent).toBe(text);
  });
});
