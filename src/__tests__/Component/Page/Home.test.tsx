import React from 'react';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Home from '../../../Component/Page/Home';

test('default', () => {
    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <Home />
        </Router>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <main data-testid="page-home" class="ui padded grid">
                <div class="row"><h1 class="ui huge dividing header">Home</h1></div>
            </main>
        </div>
    `.replace(/\n {2,}/g, ''));
});
