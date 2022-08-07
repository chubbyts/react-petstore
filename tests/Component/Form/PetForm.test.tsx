import { render, screen } from '@testing-library/react';
import InvalidParameter from '../../../src/Model/Error/InvalidParameter';
import PetForm from '../../../src/Component/Form/PetForm';
import UnprocessableEntity from '../../../src/Model/Error/UnprocessableEntity';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { test, expect } from 'vitest';
import { PetRequest } from '../../../src/Model/model';

test('empty', () => {
  const submitPet = (pet: PetRequest): void => { };

  const { container } = render(<PetForm submitPet={submitPet} />);

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                    </div>
                    <div class="form-field">
                        <label>Tag</label>
                        <input type="text" name="tag" value="">
                    </div>
                    <div class="form-field">
                        <label>Vaccanations</label>
                        <div>
                            <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                        </div>
                    </div>
                    <button data-testid="submit-pet" class="btn-blue">Save</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('without error', () => {
  const submitPet = (pet: PetRequest): void => { };

  const defaultPet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    name: 'Brownie',
    vaccinations: [{ name: 'Rabies' }],
  };

  const { container } = render(<PetForm submitPet={submitPet} defaultPet={defaultPet} />);

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                    </div>
                    <div class="form-field">
                        <label>Tag</label>
                        <input type="text" name="tag" value="">
                    </div>
                    <div class="form-field">
                        <label>Vaccanations</label>
                        <div>
                            <fieldset>
                                <div class="form-field">
                                    <label>Name</label>
                                    <input type="text" name="vaccinations[0].name" value="Rabies">
                                </div>
                                <button data-testid="remove-vaccination-0" type="button" class="btn-red">Remove</button>
                            </fieldset>
                            <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                        </div>
                    </div>
                    <button data-testid="submit-pet" class="btn-blue">Save</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('with error', () => {
  const submitPet = (pet: PetRequest): void => { };

  const defaultPet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    name: '',
    vaccinations: [{ name: '' }],
  };

  const invalidParameters: Array<InvalidParameter> = [
    { name: 'name', reason: 'Should not be empty' },
    { name: 'vaccinations[0].name', reason: 'Should not be empty' },
  ];

  const unprocessableEntity = new UnprocessableEntity({
    title: 'title',
    invalidParameters: invalidParameters,
  });

  const { container } = render(
    <PetForm submitPet={submitPet} defaultPet={defaultPet} error={unprocessableEntity} />,
  );

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field error">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                        <ul>
                            <li>Should not be empty</li>
                        </ul>
                    </div>
                    <div class="form-field">
                        <label>Tag</label>
                        <input type="text" name="tag" value="">
                    </div>
                    <div class="form-field">
                        <label>Vaccanations</label>
                        <div>
                            <fieldset>
                                <div class="form-field error">
                                    <label>Name</label>
                                    <input type="text" name="vaccinations[0].name" value="">
                                    <ul>
                                        <li>Should not be empty</li>
                                    </ul>
                                </div>
                                <button data-testid="remove-vaccination-0" type="button" class="btn-red">Remove</button>
                            </fieldset>
                            <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                        </div>
                    </div>
                    <button data-testid="submit-pet" class="btn-blue">Save</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('add vaccination', async () => {
  const submitPet = (pet: PetRequest): void => { };

  const defaultPet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    name: 'Brownie',
    vaccinations: [{ name: 'Rabies' }],
  };

  const { container } = render(<PetForm submitPet={submitPet} defaultPet={defaultPet} />);

  const submitButton = await screen.findByTestId('add-vaccination');

  await userEvent.click(submitButton);

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                    </div>
                    <div class="form-field">
                        <label>Tag</label>
                        <input type="text" name="tag" value="">
                    </div>
                    <div class="form-field">
                        <label>Vaccanations</label>
                        <div>
                            <fieldset>
                                <div class="form-field">
                                    <label>Name</label>
                                    <input type="text" name="vaccinations[0].name" value="Rabies">
                                </div>
                                <button data-testid="remove-vaccination-0" type="button" class="btn-red">Remove</button>
                            </fieldset>
                            <fieldset>
                                <div class="form-field">
                                    <label>Name</label>
                                    <input type="text" name="vaccinations[1].name" value="">
                                </div>
                                <button data-testid="remove-vaccination-1" type="button" class="btn-red">Remove</button>
                            </fieldset>
                            <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                        </div>
                    </div>
                    <button data-testid="submit-pet" class="btn-blue">Save</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('remove vaccination', async () => {
  const submitPet = (pet: PetRequest): void => { };

  const defaultPet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    name: 'Brownie',
    vaccinations: [{ name: 'Rabies' }],
  };

  const { container } = render(<PetForm submitPet={submitPet} defaultPet={defaultPet} />);

  const submitButton = await screen.findByTestId('remove-vaccination-0');

  await userEvent.click(submitButton);

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                    </div>
                    <div class="form-field">
                        <label>Tag</label>
                        <input type="text" name="tag" value="">
                    </div>
                    <div class="form-field">
                        <label>Vaccanations</label>
                        <div>
                            <button data-testid="add-vaccination" type="button" class="btn-green">Add</button>
                        </div>
                    </div>
                    <button data-testid="submit-pet" class="btn-blue">Save</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('submit minimal', async () => {
  let submitPet = (pet: PetRequest) => { };

  const submitPetMock = vi.fn((pet: PetRequest) => {
    submitPet(pet);
  });

  await new Promise(async (resolve) => {
    submitPet = (pet: PetRequest) => {
      expect(pet.name).toBe('Brownie');
      expect(pet.tag).toBeUndefined();

      resolve(undefined);
    };

    const defaultPet = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      name: 'Brownie',
      tag: '',
    };

    render(<PetForm submitPet={submitPetMock} defaultPet={defaultPet} />);

    const submitButton = await screen.findByTestId('submit-pet');

    await userEvent.click(submitButton);
  });

  expect(submitPetMock.mock.calls.length).toBe(1);
});

// @todo fix test
test('submit maximal', async () => {
  let submitPet = (pet: PetRequest) => { };

  const submitPetMock = vi.fn((pet: PetRequest) => {
    submitPet(pet);
  });

  await new Promise(async (resolve) => {
    submitPet = (pet: PetRequest) => {
      expect(pet.name).toBe('Brownie');
      expect(pet.tag).toBe('0001-000');
      expect(pet.vaccinations).toHaveLength(1);
      expect(pet.vaccinations ? pet.vaccinations[0].name : '').toBe('Rabies');

      resolve(undefined);
    };

    const defaultPet = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [{ name: 'Rabies' }],
    };

    render(<PetForm submitPet={submitPetMock} defaultPet={defaultPet} />);

    const submitButton = await screen.findByTestId('submit-pet');

    await userEvent.click(submitButton);
  });

  expect(submitPetMock.mock.calls.length).toBe(1);
});
