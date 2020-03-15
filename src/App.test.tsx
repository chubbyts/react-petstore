import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('home page', () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    expect(getByTestId('navigation-top')).toBeInTheDocument();
    expect(getByTestId('navigation-left')).toBeInTheDocument();

    expect(getByTestId('page-home')).toBeInTheDocument();

    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});

test('not found', () => {
    const { getByTestId, queryByTestId } = render(
        <MemoryRouter initialEntries={['/unknown']}>
            <App />
        </MemoryRouter>
    );

    expect(getByTestId('navigation-top')).toBeInTheDocument();
    expect(getByTestId('navigation-left')).toBeInTheDocument();

    expect(getByTestId('page-not-found')).toBeInTheDocument();

    expect(queryByTestId('page-home')).toBeNull();
    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
});

// test('pet list', () => {
//     const { getByTestId, queryByTestId } = render(
//         <MemoryRouter initialEntries={['/pet']}>
//             <App />
//         </MemoryRouter>
//     );

//     expect(getByTestId('navigation-top')).toBeInTheDocument();
//     expect(getByTestId('navigation-left')).toBeInTheDocument();

//     expect(getByTestId('page-pet-list')).toBeInTheDocument();

//     expect(queryByTestId('page-home')).toBeNull();
//     expect(queryByTestId('page-pet-create')).toBeNull();
//     expect(queryByTestId('page-pet-read')).toBeNull();
//     expect(queryByTestId('page-pet-update')).toBeNull();
//     expect(queryByTestId('page-not-found')).toBeNull();
// });
