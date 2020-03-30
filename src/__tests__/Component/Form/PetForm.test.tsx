import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import InvalidParameter from '../../../Model/Error/InvalidParameter';
import PetForm from '../../../Component/Form/PetForm';
import PetRequest from '../../../Model/Pet/PetRequest';
import PetResponse from '../../../Model/Pet/PetResponse';
import UnprocessableEntity from '../../../Model/Error/UnprocessableEntity';
import Vaccination from '../../../Model/Pet/Vaccination';

test('without error', () => {
    const submitPet: { (pet: PetRequest): void; } = (pet: PetRequest): void => { };

    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const { container } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field"><
                            label>Name</label>
                            <input type="text" name="vaccinations[0].name">
                        </div>
                        <div class="field">
                            <button data-testid="remove-vaccination-0" type="button" class="ui button red">Remove</button>
                        </div>
                    </div>
                    <button data-testid="add-vaccination" type="button" class="ui button green">Add</button>
                </div>
                <button data-testid="submit-pet" class="ui button blue">Submit</button>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('with error', () => {
    const submitPet: { (pet: PetRequest): any; } = (pet: PetRequest) => { };

    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: '',
        vaccinations: [
            new Vaccination({ name: '' })
        ]
    });

    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'Should not be empty' },
        { name: 'vaccinations[0].name', reason: 'Should not be empty' }
    ];

    const unprocessableEntity = new UnprocessableEntity({
        title: 'title',
        invalidParameters: invalidParameters
    });

    const { container } = render(
        <PetForm submitPet={submitPet} pet={pet} error={unprocessableEntity} />
    );

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field error">
                    <label>Name</label>
                    <input type="text" name="name">
                    <div class="ui pointing red basic label">Should not be empty</div>
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field error"><
                            label>Name</label>
                            <input type="text" name="vaccinations[0].name">
                            <div class="ui pointing red basic label">Should not be empty</div>
                        </div>
                        <div class="field">
                            <button data-testid="remove-vaccination-0" type="button" class="ui button red">Remove</button>
                        </div>
                    </div>
                    <button data-testid="add-vaccination" type="button" class="ui button green">Add</button>
                </div>
                <button data-testid="submit-pet" class="ui button blue">Submit</button>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('add vaccination', async () => {
    const submitPet: { (pet: PetRequest): any; } = (pet: PetRequest) => { };

    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const { container, findByTestId } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    const submitButton = await findByTestId('add-vaccination');

    fireEvent.click(submitButton);

    await findByTestId('add-vaccination');

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field">
                            <label>Name</label>
                            <input type="text" name="vaccinations[0].name">
                        </div>
                        <div class="field">
                            <button data-testid="remove-vaccination-0" type="button" class="ui button red">Remove</button>
                        </div>
                    </div>
                    <div class="ui bottom attached segment">
                        <div class="field">
                            <label>Name</label>
                            <input type="text" name="vaccinations[1].name">
                        </div>
                        <div class="field">
                            <button data-testid="remove-vaccination-1" type="button" class="ui button red">Remove</button>
                        </div>
                    </div>
                    <button data-testid="add-vaccination" type="button" class="ui button green">Add</button>
                </div>
                <button data-testid="submit-pet" class="ui button blue">Submit</button>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('remove vaccination', async () => {
    const submitPet: { (pet: PetRequest): any; } = (pet: PetRequest) => { };

    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const { container, findByTestId } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    const submitButton = await findByTestId('remove-vaccination-0');

    fireEvent.click(submitButton);

    await findByTestId('submit-pet');

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <button data-testid="add-vaccination" type="button" class="ui button green">Add</button>
                </div>
                <button data-testid="submit-pet" class="ui button blue">Submit</button>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('submit', async () => {
    const submitPet: { (pet: PetRequest): any; } = jest.fn((pet: PetRequest) => { });

    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    const { container, findByTestId } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    const submitButton = await findByTestId('submit-pet');

    fireEvent.click(submitButton);

    await findByTestId('submit-pet');

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field"><
                            label>Name</label>
                            <input type="text" name="vaccinations[0].name">
                        </div>
                        <div class="field">
                            <button data-testid="remove-vaccination-0" type="button" class="ui button red">Remove</button>
                        </div>
                    </div>
                    <button data-testid="add-vaccination" type="button" class="ui button green">Add</button>
                </div>
                <button data-testid="submit-pet" class="ui button blue">Submit</button>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));

    expect(submitPet.mock.calls.length).toBe(1);
});
