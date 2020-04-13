import React from 'react';
import { createMemoryHistory } from 'history';
import { fireEvent, render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import Create from '../../../../Component/Page/Pet/Create';
import HttpError from '../../../../Model/Error/HttpError';
import PetFormProps from '../../../../Component/Form/PetFormProps';
import PetResponse from '../../../../Model/Pet/PetResponse';
import UnprocessableEntity from '../../../../Model/Error/UnprocessableEntity';

jest.mock('../../../../ApiClient/Pet');

jest.mock('../../../../Component/Form/PetForm', () => {
    return ({ submitPet }: PetFormProps) => {
        const submit = async () => {
            await submitPet({ name: '', vaccinations: [] });
        };

        return (<button data-testid="test-button" onClick={submit}></button>);
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
    ApiClientPet.CreatePet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new UnprocessableEntity({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const { container, findByTestId } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

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
    ApiClientPet.CreatePet.mockImplementationOnce((pet: PetResponse) => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const { findByTestId } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(history.location.pathname).toBe('/pet');
});
