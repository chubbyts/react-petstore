import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Top from '../../../Component/Navigation/Top';
import { MemoryRouter } from 'react-router-dom';

test('default', () => {
    const { container } = render(
        <MemoryRouter>
            <Top />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <nav>
                <div class="ui tablet computer only padded grid">
                    <div class="ui inverted borderless top fixed fluid menu">
                        <a aria-current="page" class="header item active" href="/">Petstore</a>
                    </div>
                </div>
                <div class="ui mobile only padded grid">
                    <div class="ui top fixed borderless fluid inverted menu">
                        <a aria-current="page" class="header item active" href="/">Petstore</a>
                        <div class="right menu">
                            <div class="item">
                                <button data-testid="navigation-top-toggle" class="ui icon toggle basic inverted button"><i class="content icon"></i></button>
                            </div>
                        </div>
                        <div class="ui vertical borderless inverted fluid menu">
                            <a class="item" href="/pet">Pet</a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('toggle', () => {
    const { container, getByTestId } = render(
        <MemoryRouter>
            <Top />
        </MemoryRouter>
    );

    fireEvent.click(getByTestId('navigation-top-toggle'));

    expect(container.outerHTML).toBe(`
        <div>
            <nav>
                <div class="ui tablet computer only padded grid">
                    <div class="ui inverted borderless top fixed fluid menu">
                        <a aria-current="page" class="header item active" href="/">Petstore</a>
                    </div>
                </div>
                <div class="ui mobile only padded grid">
                    <div class="ui top fixed borderless fluid inverted menu">
                        <a aria-current="page" class="header item active" href="/">Petstore</a>
                        <div class="right menu">
                            <div class="item">
                                <button data-testid="navigation-top-toggle" class="ui icon toggle basic inverted button"><i class="content icon"></i></button>
                            </div>
                        </div>
                        <div class="ui vertical borderless inverted fluid menu visible">
                            <a class="item" href="/pet">Pet</a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <Top />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <nav>
                <div class="ui tablet computer only padded grid">
                    <div class="ui inverted borderless top fixed fluid menu">
                        <a aria-current="page" class="header item active" href="/">Petstore</a>
                    </div>
                </div>
                <div class="ui mobile only padded grid">
                    <div class="ui top fixed borderless fluid inverted menu">
                        <a aria-current="page" class="header item active" href="/">Petstore</a>
                        <div class="right menu">
                            <div class="item">
                                <button data-testid="navigation-top-toggle" class="ui icon toggle basic inverted button"><i class="content icon"></i></button>
                            </div>
                        </div>
                        <div class="ui vertical borderless inverted fluid menu">
                            <a aria-current="page" class="item active" href="/pet">Pet</a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    `.replace(/\n {2,}/g, ''));
});
