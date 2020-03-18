import React from 'react';
import { render, waitForElement, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Create from '../../../../Component/Page/Pet/Create';
import HttpErrorPartial from '../../../../Component/Partial/HttpError';
import PetForm from '../../../../Component/Form/PetForm';
import Pet from '../../../../Type/Pet/Pet';
import UnprocessableEntity from '../../../../Type/Error/UnprocessableEntity';
import PetFormProps from '../../../../Type/Props/PetFormProps';
import * as ApiClientPet from '../../../../ApiClient/Pet';

jest.mock('../../../../ApiClient/Pet');

let mockPetForm = (props: PetFormProps) => {};

jest.mock('../../../../Component/Form/PetForm', () => {
    return (props: PetFormProps) => {
        return mockPetForm(props)
    };
});

test('default', async () => {
    mockPetForm = (props: PetFormProps) => {
        return '___petForm___';
    };

    const { getByTestId } = render(
        <MemoryRouter>
            <Create />
        </MemoryRouter>
    );

    const navigationLeft = await waitForElement(() =>
        getByTestId('page-pet-create')
    );

    expect(navigationLeft.outerHTML).toBe(`
    <main data-testid="page-pet-create" class="ui padded grid">
        <div class="row"><h1 class="ui huge dividing header">Create Pet</h1></div>
        <div class="row"><div class="ui attached segment">___petForm___</div></div>
        <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
    </main>
    `.replace(/\n {2,}/g, ''));
});


test('submit failure', async () => {
    ApiClientPet.CreatePet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new UnprocessableEntity({title: 'title'}));
    }));

    const pet: Pet = {
        id: '22a18f88-56f2-41e9-82ab-27084961ba93',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Black Beauty',
        vaccinations: [],
        _links: {}
    };

    mockPetForm = ({ submitPet }: PetFormProps) => {
        // submitPet(pet); after a click?

        return '___petForm_submit_success___';
    };

    const { getByTestId } = render(
        <MemoryRouter>
            <Create />
        </MemoryRouter>
    );

    const navigationLeft = await waitForElement(() =>
        getByTestId('page-pet-create')
    );

    expect(navigationLeft.outerHTML).toBe(`
    <main data-testid="page-pet-create" class="ui padded grid">
        <div class="row"><h1 class="ui huge dividing header">Create Pet</h1></div>
        <div class="row"><div class="ui attached segment">___petForm_submit_success___</div></div>
        <div class="row"><a class="ui button" role="button" href="/pet">List</a></div>
    </main>
    `.replace(/\n {2,}/g, ''));
});
