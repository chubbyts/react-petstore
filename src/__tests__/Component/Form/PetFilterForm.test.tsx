import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import BadRequest from '../../../Type/Error/BadRequest';
import InvalidParameter from '../../../Type/Error/InvalidParameter';
import PetFilterForm from '../../../Component/Form/PetFilterForm';

test('without error', () => {
    const submitPetFilter: { (filters: any): any; } = (filters: any) => { };

    const filters = {
        name: 'aa'
    };

    const { container } = render(
        <PetFilterForm submitPetFilter={submitPetFilter} filters={filters} />
    );

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="inline fields">
                    <div class="field">
                        <label>Name</label>
                        <input type="text" name="name">
                    </div>
                    <button data-testid="submit-pet-filter" class="ui button blue">Filter</button>
                </div>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('with error', () => {
    const submitPetFilter: { (filters: any): any; } = (filters: any) => { };

    const filters = {
        name: ''
    };

    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'Should not be empty' },
    ];

    const badRequest = new BadRequest({
        title: 'title',
        invalidParameters: invalidParameters
    });

    const { container } = render(
        <PetFilterForm submitPetFilter={submitPetFilter} filters={filters} error={badRequest} />
    );

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="inline fields">
                    <div class="field error">
                        <label>Name</label>
                        <input type="text" name="name">
                        <div class="ui pointing red basic label">Should not be empty</div>
                    </div>
                    <button data-testid="submit-pet-filter" class="ui button blue">Filter</button>
                </div>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('submit', async () => {
    const submitPetFilter: { (filters: any): any; } = jest.fn((filters: any) => { });

    const filters = {
        name: 'aa'
    };

    const { container, findByTestId } = render(
        <PetFilterForm submitPetFilter={submitPetFilter} filters={filters} />
    );

    const submitButton = await findByTestId('submit-pet-filter');

    fireEvent.click(submitButton);

    await findByTestId('submit-pet-filter');

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="inline fields">
                    <div class="field">
                        <label>Name</label>
                        <input type="text" name="name">
                    </div>
                    <button data-testid="submit-pet-filter" class="ui button blue">Filter</button>
                </div>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));

    expect(submitPetFilter.mock.calls.length).toBe(1);
});

test('submit empty', async () => {
    const submitPetFilter: { (filters: any): any; } = jest.fn((filters: any) => { });

    const filters = {
        name: ''
    };

    const { container, findByTestId } = render(
        <PetFilterForm submitPetFilter={submitPetFilter} filters={filters} />
    );

    const submitButton = await findByTestId('submit-pet-filter');

    fireEvent.click(submitButton);

    await findByTestId('submit-pet-filter');

    expect(container.outerHTML).toBe(`
        <div>
            <form class="ui form">
                <div class="inline fields">
                    <div class="field">
                        <label>Name</label>
                        <input type="text" name="name">
                    </div>
                    <button data-testid="submit-pet-filter" class="ui button blue">Filter</button>
                </div>
            </form>
        </div>
    `.replace(/\n {2,}/g, ''));

    expect(submitPetFilter.mock.calls.length).toBe(1);
});
