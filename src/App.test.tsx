import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('home page', () => {
    const { getByTestId, queryByTestId } = render(<App />);

    expect(getByTestId('navigation-top')).toBeInTheDocument();
    expect(getByTestId('navigation-left')).toBeInTheDocument();

    expect(getByTestId('page-home')).toBeInTheDocument();

    expect(queryByTestId('page-pet-create')).toBeNull();
    expect(queryByTestId('page-pet-list')).toBeNull();
    expect(queryByTestId('page-pet-read')).toBeNull();
    expect(queryByTestId('page-pet-update')).toBeNull();
    expect(queryByTestId('page-not-found')).toBeNull();
});
