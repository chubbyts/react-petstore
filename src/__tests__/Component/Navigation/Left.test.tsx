import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import Left from '../../../Component/Navigation/Left';
import { MemoryRouter } from 'react-router-dom';

test('default', async () => {
    const { getByTestId } = render(
        <MemoryRouter>
            <Left />
        </MemoryRouter>
    );

    const navigationLeft = await waitForElement(() =>
        getByTestId('navigation-left')
    );

    expect(navigationLeft.outerHTML).toBe(`
        <nav data-testid="navigation-left" id="sidebar" class="three wide tablet only three wide computer only column">
            <div class="ui vertical borderless fluid text menu">
                <a class="item" href="/pet">Pet</a>
            </div>
        </nav>
    `.replace(/\n {2,}/g, ''));
});

test('pet', async () => {
    const { getByTestId } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <Left />
        </MemoryRouter>
    );

    const navigationLeft = await waitForElement(() =>
        getByTestId('navigation-left')
    );

    expect(navigationLeft.outerHTML).toBe(`
        <nav data-testid="navigation-left" id="sidebar" class="three wide tablet only three wide computer only column">
            <div class="ui vertical borderless fluid text menu">
                <a aria-current="page" class="item active" href="/pet">Pet</a>
            </div>
        </nav>
    `.replace(/\n {2,}/g, ''));
});
