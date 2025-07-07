import { render } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import Home from '../../../src/component/page/home';
import { formatHtml } from '../../formatter';

describe('home', () => {
  test('default', () => {
    const { container } = render(<Home />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">Home</h1>
      </div>
    </div>
    "
  `);
  });
});
