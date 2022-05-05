import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import Home from '../../../Component/Page/Home';

test('default', () => {
    const history = createMemoryHistory();

    const { container } = render(
        <HistoryRouter history={history}>
            <Home />
        </HistoryRouter>,
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
