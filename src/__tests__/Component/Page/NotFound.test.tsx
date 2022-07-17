import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import NotFound from '../../../Component/Page/NotFound';

test('default', () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <NotFound />
    </Router>,
  );

  expect(container.outerHTML).toBe(
    `
        <div>
            <div>
                <h1>Not Found</h1>
            </div>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});
