import React from 'react';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import NotFound from '../../../Component/Page/NotFound';

test('default', () => {
    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <NotFound />
        </Router>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main data-testid="page-not-found" class="ui padded grid">
                <div class="row"><h1 class="ui huge dividing header">Not Found</h1></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});
