import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import NotFound from '../../../src/Component/Page/NotFound';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';

test('default', () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <NotFound />
    </Router>,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><h1>Not Found</h1></div>
    </div>
    "
  `);
});
