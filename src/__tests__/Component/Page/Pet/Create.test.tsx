import React from 'react';
import { createMemoryHistory } from 'history';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import Create from '../../../../Component/Page/Pet/Create';
import HttpError from '../../../../Type/Error/HttpError';
import Pet from '../../../../Type/Pet/Pet';
import PetFormProps from '../../../../Type/Props/PetFormProps';
import UnprocessableEntity from '../../../../Type/Error/UnprocessableEntity';

jest.mock('../../../../ApiClient/Pet');

jest.mock('../../../../Component/Form/PetForm', () => {
    return ({ submitPet }: PetFormProps) => {
        const submit = async () => {
            await submitPet({ id: '', createdAt: '', name: '', vaccinations: [], _links: {} });
        };

        return (<button data-testid="test-button" onClick={submit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div className="row">httpError: {httpError.title}</div>);
    };
});

test('default', async () => {
    const history = createMemoryHistory();

    const { getByTestId } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    const navigationLeft = await waitForElement(() =>
        getByTestId('page-pet-create')
    );

    expect(navigationLeft.outerHTML).toBe(`
        <main data-testid="page-pet-create" class="ui padded grid">
            <div class="row"><h1 class="ui huge dividing header">Create Pet</h1></div>
            <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
            <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
        </main>
    `.replace(/\n {2,}/g, ''));
});

test('unprocessable entity', async () => {
    ApiClientPet.CreatePet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new UnprocessableEntity({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const { getByTestId } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    const testButton = await waitForElement(() =>
        getByTestId('test-button')
    );

    fireEvent.click(testButton);

    const navigationLeft = await waitForElement(() =>
        getByTestId('page-pet-create')
    );

    expect(navigationLeft.outerHTML).toBe(`
        <main data-testid="page-pet-create" class="ui padded grid">
            <div class="row">httpError: title</div>
            <div class="row"><h1 class="ui huge dividing header">Create Pet</h1></div>
            <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
            <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
        </main>
    `.replace(/\n {2,}/g, ''));
});

test('successful', async () => {
    ApiClientPet.CreatePet.mockImplementationOnce((pet: Pet) => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const { getByTestId } = render(
        <Router history={history}>
            <Create />
        </Router>
    );

    const testButton = await waitForElement(() =>
        getByTestId('test-button')
    );

    expect(history.location.pathname).toBe('/');

    fireEvent.click(testButton);

    const navigationLeft = await waitForElement(() =>
        getByTestId('page-pet-create')
    );

    expect(navigationLeft.outerHTML).toBe(`
        <main data-testid="page-pet-create" class="ui padded grid">
            <div class="row"><h1 class="ui huge dividing header">Create Pet</h1></div>
            <div class="row"><div class="ui attached segment"><button data-testid="test-button"></button></div></div>
            <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
        </main>
    `.replace(/\n {2,}/g, ''));

    expect(history.location.pathname).toBe('/pet');
});
