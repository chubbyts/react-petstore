import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import NotFound from '../../../src/component/page/not-found';
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
