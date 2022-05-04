import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import NotFound from '../../../Component/Page/NotFound';

test('default', () => {
    const history = createMemoryHistory();

    const { container } = render(
        <HistoryRouter history={history}>
            <NotFound />
        </HistoryRouter>,
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
