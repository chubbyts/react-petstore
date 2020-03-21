import React from 'react';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import UnprocessableEntity from '../../../Type/Error/UnprocessableEntity';
import InvalidParameter from '../../../Type/Error/InvalidParameter';
import Pet from '../../../Type/Pet/Pet';
import PetForm from '../../../Component/Form/PetForm';

test('without error', () => {
    const submitPet: { (pet: Pet): any; } = (pet: Pet) => { };

    const pet: Pet = {
        id: '',
        createdAt: '',
        name: 'Brownie',
        vaccinations: [
            { name: 'Rabies' }
        ],
        _links: {}
    };

    const { container } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name" value="Brownie">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field"><
                            label>Name</label>
                            <input type="text" name="vaccinations[0].name" value="Rabies">
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
    const submitPet: { (pet: Pet): any; } = (pet: Pet) => { };

    const pet: Pet = {
        id: '',
        createdAt: '',
        name: '',
        vaccinations: [
            { name: '' }
        ],
        _links: {}
    };

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
                    <input type="text" name="name" value="">
                    <div class="ui pointing red basic label">Should not be empty</div>
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field error"><
                            label>Name</label>
                            <input type="text" name="vaccinations[0].name" value="">
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

test('add vaccination', () => {
    const submitPet: { (pet: Pet): any; } = (pet: Pet) => { };

    const pet: Pet = {
        id: '',
        createdAt: '',
        name: 'Brownie',
        vaccinations: [
            { name: 'Rabies' }
        ],
        _links: {}
    };

    const { container, getByTestId } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    fireEvent.click(getByTestId('add-vaccination'));

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name" value="Brownie">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field">
                            <label>Name</label>
                            <input type="text" name="vaccinations[0].name" value="Rabies">
                        </div>
                        <div class="field">
                            <button data-testid="remove-vaccination-0" type="button" class="ui button red">Remove</button>
                        </div>
                    </div>
                    <div class="ui bottom attached segment">
                        <div class="field">
                            <label>Name</label>
                            <input type="text" name="vaccinations[1].name" value="">
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

test('remove vaccination', () => {
    const submitPet: { (pet: Pet): any; } = (pet: Pet) => { };

    const pet: Pet = {
        id: '',
        createdAt: '',
        name: 'Brownie',
        vaccinations: [
            { name: 'Rabies' }
        ],
        _links: {}
    };

    const { container, getByTestId } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    fireEvent.click(getByTestId('remove-vaccination-0'));

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name" value="Brownie">
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
    const submitPet: { (pet: Pet): any; } = jest.fn((pet: Pet) => { });

    const pet: Pet = {
        id: '',
        createdAt: '',
        name: 'Brownie',
        vaccinations: [
            { name: 'Rabies' }
        ],
        _links: {}
    };

    const { container, getByTestId } = render(
        <PetForm submitPet={submitPet} pet={pet} />
    );

    fireEvent.click(getByTestId('submit-pet'));

    await waitForElement(() =>
        getByTestId('submit-pet')
    );

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="name" value="Brownie">
                </div>
                <div class="field">
                    <label>Vaccination</label>
                    <div class="ui bottom attached segment">
                        <div class="field"><
                            label>Name</label>
                            <input type="text" name="vaccinations[0].name" value="Rabies">
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
