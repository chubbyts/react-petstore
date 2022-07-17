import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Home from '../../../Component/Page/Home';
import { test, expect } from 'vitest';

test('default', () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Home />
    </Router>,
  );

  expect(container.outerHTML).toBe(
    `
        <div>
            <div>
                <h1>Home</h1>
            </div>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});
