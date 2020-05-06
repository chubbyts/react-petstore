import React from 'react';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Create from '../../../../Component/Page/Pet/Create';
import HttpError from '../../../../Model/Error/HttpError';
import PetFormProps from '../../../../Component/Form/PetFormProps';
import PetRequest from '../../../../Model/Pet/PetRequest';
import UnprocessableEntity from '../../../../Model/Error/UnprocessableEntity';
import userEvent from '@testing-library/user-event';

let mockCreatePet = (pet: PetRequest) => { };

jest.mock('../../../../ApiClient/Pet', () => {
    return {
        CreatePet: (pet: PetRequest) => {
            return mockCreatePet(pet);
        }
    };
});

jest.mock('../../../../Component/Form/PetForm', () => {
    return ({ submitPet }: PetFormProps) => {
        const onSubmit = () => {
            submitPet({ name: 'Brownie' });
        };

        return (<button data-testid="test-button" onClick={onSubmit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div>httpError: {httpError.title}</div>);
    };
});

test('default', () => {
    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-create">
                <h1>Create Pet</h1>
                <button data-testid="test-button"></button>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('unprocessable entity', async () => {
    mockCreatePet = async (pet: PetRequest) => {
        return new Promise((resolve) => resolve(new UnprocessableEntity({ title: 'title' })));
    };

    const history = createMemoryHistory();

    const { container } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    const testButton = await screen.findByTestId('test-button');

    userEvent.click(testButton);

    await screen.findByTestId('test-button');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-create">
                <div>httpError: title</div>
                <h1>Create Pet</h1>
                <button data-testid="test-button"></button>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('successful', async () => {
    mockCreatePet = async (pet: PetRequest) => {
        return new Promise((resolve) => resolve(pet));
    };

    const history = createMemoryHistory();

    render(
        <Router history={history}>
            <Create />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const testButton = await screen.findByTestId('test-button');

    userEvent.click(testButton);

    await screen.findByTestId('test-button');

    expect(history.location.pathname).toBe('/pet');
});
