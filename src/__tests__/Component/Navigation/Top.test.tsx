import React from 'react';
import { fireEvent, render, waitForElement, act } from '@testing-library/react';
import Top from '../../../Component/Navigation/Top';
import { MemoryRouter } from 'react-router-dom';

test('default', async () => {
    const { getByTestId } = render(
        <MemoryRouter>
            <Top />
        </MemoryRouter>
    );

    const navigationTop = await waitForElement(() =>
        getByTestId('navigation-top')
    );

    expect(navigationTop.outerHTML).toBe(`
        <nav data-testid="navigation-top">
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
    `.replace(/\n {2,}/g, ''));
});

test('toggle', async () => {
    const { getByTestId } = render(
        <MemoryRouter>
            <Top />
        </MemoryRouter>
    );

    const navigationTop = await waitForElement(() =>
        getByTestId('navigation-top')
    );

    fireEvent.click(getByTestId('navigation-top-toggle'));

    expect(navigationTop.outerHTML).toBe(`
        <nav data-testid="navigation-top">
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
    `.replace(/\n {2,}/g, ''));
});

test('pet', async () => {
    const { getByTestId } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <Top />
        </MemoryRouter>
    );

    const navigationTop = await waitForElement(() =>
        getByTestId('navigation-top')
    );

    expect(navigationTop.outerHTML).toBe(`
        <nav data-testid="navigation-top">
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
    `.replace(/\n {2,}/g, ''));
});
