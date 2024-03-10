// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import NotFound from '../../../src/component/page/not-found';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';

test('default', () => {
  const { container } = render(<NotFound />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><h1 class="mb-4 border-b pb-2 text-4xl font-black">Not Found</h1></div>
    </div>
    "
  `);
});
