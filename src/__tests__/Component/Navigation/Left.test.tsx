import React from 'react';
import { render } from '@testing-library/react';
import Left from '../../../Component/Navigation/Left';
import { MemoryRouter } from 'react-router-dom';

test('default', () => {
    const { container } = render(
        <MemoryRouter>
            <Left />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <nav id="sidebar" class="three wide tablet only three wide computer only column">
                <div class="ui vertical borderless fluid text menu">
                    <a class="item" href="/pet">Pet</a>
                </div>
            </nav>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <Left />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <nav id="sidebar" class="three wide tablet only three wide computer only column">
                <div class="ui vertical borderless fluid text menu">
                    <a aria-current="page" class="item active" href="/pet">Pet</a>
                </div>
            </nav>
        </div>
    `.replace(/\n {2,}/g, ''));
});
