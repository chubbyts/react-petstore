import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Home from '../../../src/component/page/home';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';

test('default', () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Home />
    </Router>,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><h1>Home</h1></div>
    </div>
    "
  `);
});
