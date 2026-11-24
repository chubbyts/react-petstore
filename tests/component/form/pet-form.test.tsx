import { test, expect, vi, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { formatHtml } from '../../formatter';
import type { PetFormProps } from '../../../src/component/form/pet-form';
import { PetForm } from '../../../src/component/form/pet-form';
import { BadRequest, NetworkError } from '../../../src/client/error';
import type { PetRequest } from '../../../src/model/pet';

const submitPet = (): void => {};

const renderInRouter = (element: ReactElement) => render(<MemoryRouter>{element}</MemoryRouter>);

// values of the fields marked invalid
const invalidValues = () =>
  [...document.querySelectorAll<HTMLInputElement>('input[aria-invalid="true"]')].map((input) => input.value);

const defaultProps: PetFormProps = { submitPet, submitLabel: 'Create pet', cancelTo: '/pet', listTo: '/pet' };

describe('pet-form', () => {
  test('without initial pet', () => {
    const { container } = renderInRouter(<PetForm {...defaultProps} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <form
          class="flex flex-col rounded-xl border border-line bg-surface"
          novalidate=""
        >
          <div class="flex flex-col gap-5 p-4.5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label for="pet-name" class="text-sm font-semibold"
                  >Name <span aria-hidden="true" class="text-danger">*</span></label
                ><input
                  data-testid="pet-form-name"
                  id="pet-name"
                  class="h-11 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-line-control bg-canvas"
                  aria-required="true"
                  type="text"
                  value=""
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="pet-tag" class="text-sm font-semibold"
                  >Tag
                  <span class="text-fg-muted font-normal">· optional</span></label
                ><input
                  data-testid="pet-form-tag"
                  id="pet-tag"
                  class="h-11 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-line-control bg-canvas"
                  placeholder="e.g. dog, cat"
                  type="text"
                  value=""
                />
              </div>
            </div>
            <div
              role="group"
              aria-labelledby="pet-vaccinations"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center justify-between gap-2">
                <span id="pet-vaccinations" class="text-sm font-semibold"
                  >Vaccinations
                  <span class="text-fg-muted font-normal">(0)</span></span
                ><button
                  data-testid="pet-form-add-vaccination"
                  id="pet-add-vaccination"
                  type="button"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg text-sm"
                >
                  + Add vaccination
                </button>
              </div>
              <p
                class="border-line-strong text-fg-muted m-0 rounded-lg border border-dashed p-4 text-center text-sm"
              >
                No vaccinations yet.
              </p>
            </div>
          </div>
          <div
            class="border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5"
          >
            <span class="flex-1"></span
            ><a
              data-testid="back-to-list"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet"
              data-discover="true"
              ><svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 12H5"></path>
                <path d="m12 19-7-7 7-7"></path></svg
              >Back to list</a
            ><a
              data-testid="pet-form-cancel"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet"
              data-discover="true"
              >Cancel</a
            ><button
              data-testid="pet-form-submit"
              type="submit"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
            >
              Create pet
            </button>
          </div>
        </form>
      </div>
      "
    `);
  });

  test('with initial pet and meta', () => {
    const initialPet = { name: 'Brownie', tag: '0001-000', vaccinations: [{ name: 'rabies' }] };

    const { container } = renderInRouter(
      <PetForm
        {...defaultProps}
        initialPet={initialPet}
        submitLabel="Save changes"
        cancelTo="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
        meta={<span data-testid="meta">meta</span>}
        isPending
      />,
    );

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <form
          class="flex flex-col rounded-xl border border-line bg-surface"
          novalidate=""
        >
          <div class="flex flex-col gap-5 p-4.5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label for="pet-name" class="text-sm font-semibold"
                  >Name <span aria-hidden="true" class="text-danger">*</span></label
                ><input
                  data-testid="pet-form-name"
                  id="pet-name"
                  class="h-11 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-line-control bg-canvas"
                  aria-required="true"
                  type="text"
                  value="Brownie"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="pet-tag" class="text-sm font-semibold"
                  >Tag
                  <span class="text-fg-muted font-normal">· optional</span></label
                ><input
                  data-testid="pet-form-tag"
                  id="pet-tag"
                  class="h-11 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-line-control bg-canvas"
                  placeholder="e.g. dog, cat"
                  type="text"
                  value="0001-000"
                />
              </div>
            </div>
            <div
              role="group"
              aria-labelledby="pet-vaccinations"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center justify-between gap-2">
                <span id="pet-vaccinations" class="text-sm font-semibold"
                  >Vaccinations
                  <span class="text-fg-muted font-normal">(1)</span></span
                ><button
                  data-testid="pet-form-add-vaccination"
                  id="pet-add-vaccination"
                  type="button"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg text-sm"
                >
                  + Add vaccination
                </button>
              </div>
              <ol class="m-0 flex list-none flex-col gap-2 p-0">
                <li class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <input
                      data-testid="pet-form-vaccinations-0-name"
                      id="pet-vaccination-0"
                      aria-label="Vaccination 1 name"
                      class="h-10 flex-1 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-line-control bg-canvas"
                      type="text"
                      value="rabies"
                    /><button
                      data-testid="pet-form-remove-vaccination-0"
                      aria-label="Remove vaccination 1"
                      type="button"
                      class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-10 rounded-lg px-3 font-medium text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover border-line-control border"
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4h8v2"></path>
                        <path d="M6 6l1 14h10l1-14"></path></svg
                      >Remove
                    </button>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div
            class="border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5"
          >
            <span data-testid="meta">meta</span><span class="flex-1"></span
            ><a
              data-testid="back-to-list"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet"
              data-discover="true"
              ><svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 12H5"></path>
                <path d="m12 19-7-7 7-7"></path></svg
              >Back to list</a
            ><a
              data-testid="pet-form-cancel"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
              data-discover="true"
              >Cancel</a
            ><button
              data-testid="pet-form-submit"
              disabled=""
              type="submit"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
      "
    `);
  });

  test('footer actions: back to list, cancel, submit', () => {
    renderInRouter(<PetForm {...defaultProps} cancelTo="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9" />);

    const actions = [
      screen.getByRole('link', { name: 'Back to list' }),
      screen.getByRole('link', { name: 'Cancel' }),
      screen.getByRole('button', { name: 'Create pet' }),
    ];

    expect(actions.map((action) => action.textContent)).toEqual(['Back to list', 'Cancel', 'Create pet']);
    expect(actions[0].compareDocumentPosition(actions[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(actions[1].compareDocumentPosition(actions[2]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(actions[0].getAttribute('href')).toBe('/pet');
    expect(actions[1].getAttribute('href')).toBe('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');
  });

  test('name is required', () => {
    renderInRouter(<PetForm {...defaultProps} />);

    const name = screen.getByRole('textbox', { name: 'Name' });

    expect(name.getAttribute('aria-required')).toBe('true');
    expect(screen.getByRole('textbox', { name: 'Tag · optional' }).getAttribute('aria-required')).toBeNull();
  });

  test('focus follows adding and removing vaccinations', async () => {
    renderInRouter(<PetForm {...defaultProps} />);

    const add = screen.getByRole('button', { name: '+ Add vaccination' });

    await userEvent.click(add);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Vaccination 1 name' }));

    await userEvent.click(add);
    await userEvent.click(add);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Vaccination 3 name' }));

    // middle: continue at the row now at that place
    await userEvent.click(screen.getByRole('button', { name: 'Remove vaccination 2' }));
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Vaccination 2 name' }));

    // last: continue at the previous row
    await userEvent.click(screen.getByRole('button', { name: 'Remove vaccination 2' }));
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Vaccination 1 name' }));

    // only one: continue at add
    await userEvent.click(screen.getByRole('button', { name: 'Remove vaccination 1' }));
    expect(document.activeElement).toBe(add);
  });

  test('after a failed save the first invalid field gets the focus', () => {
    const initialPet = { name: 'Brownie', vaccinations: [{ name: '' }] };

    const { rerender } = renderInRouter(<PetForm {...defaultProps} initialPet={initialPet} />);

    expect(document.activeElement).toBe(document.body);

    rerender(
      <MemoryRouter>
        <PetForm
          {...defaultProps}
          initialPet={initialPet}
          httpError={
            new BadRequest({
              title: 'Bad Request',
              invalidParameters: [{ name: 'vaccinations[0][name]', reason: 'Too small' }],
            })
          }
        />
      </MemoryRouter>,
    );

    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Vaccination 1 name' }));
  });

  test('errors of a vaccination stay with it when other vaccinations get added / removed', async () => {
    const submitPetMock = vi.fn((_: PetRequest) => {});
    const initialPet = { name: 'Brownie', vaccinations: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] };
    const httpError = new BadRequest({
      title: 'Bad Request',
      invalidParameters: [{ name: 'vaccinations[1][name]', reason: 'Invalid B' }],
    });

    const { rerender } = renderInRouter(
      <PetForm {...defaultProps} initialPet={initialPet} submitPet={submitPetMock} />,
    );

    await userEvent.click(screen.getByTestId('pet-form-submit'));
    rerender(
      <MemoryRouter>
        <PetForm {...defaultProps} initialPet={initialPet} submitPet={submitPetMock} httpError={httpError} />
      </MemoryRouter>,
    );

    expect(invalidValues()).toEqual(['B']);

    // the one before: B moves up, its error with it
    await userEvent.click(screen.getByRole('button', { name: 'Remove vaccination 1' }));
    expect(invalidValues()).toEqual(['B']);
    expect(screen.getByText('Invalid B')).toBeTruthy();

    // added after the submit: no error
    await userEvent.click(screen.getByRole('button', { name: '+ Add vaccination' }));
    expect(invalidValues()).toEqual(['B']);

    // the invalid one: its error is gone, not moved to C
    await userEvent.click(screen.getByRole('button', { name: 'Remove vaccination 1' }));
    expect(invalidValues()).toEqual([]);
    expect(screen.queryByText('Invalid B')).toBeNull();
  });

  test('network error', () => {
    const httpError = new NetworkError({ title: 'network error' });

    renderInRouter(<PetForm {...defaultProps} httpError={httpError} />);

    // shown on top of the page (see usePageError), the form only shows the invalid parameters next to the fields
    expect(screen.queryByTestId('http-error')).toBeNull();
    expect(document.querySelector('[aria-invalid="true"]')).toBeNull();
  });

  test('bad request with invalid parameters', () => {
    const httpError = new BadRequest({
      title: 'Bad Request',
      invalidParameters: [
        { name: 'name', reason: 'reason1' },
        { name: 'tag', reason: 'reason2' },
        { name: 'vaccinations', reason: 'reason3' },
        { name: 'vaccinations[0][name]', reason: 'reason4' },
      ],
    });
    const initialPet = { name: '', tag: '0001-000', vaccinations: [{ name: '' }] };

    const { container } = renderInRouter(<PetForm {...defaultProps} httpError={httpError} initialPet={initialPet} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <form
          class="flex flex-col rounded-xl border border-line bg-surface"
          novalidate=""
        >
          <div class="flex flex-col gap-5 p-4.5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label for="pet-name" class="text-sm font-semibold"
                  >Name <span aria-hidden="true" class="text-danger">*</span></label
                ><input
                  data-testid="pet-form-name"
                  id="pet-name"
                  class="h-11 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-danger-field-line bg-danger-field"
                  aria-required="true"
                  aria-invalid="true"
                  aria-describedby="pet-name-errors"
                  type="text"
                  value=""
                />
                <ul
                  id="pet-name-errors"
                  class="text-danger m-0 list-none p-0 text-[13px]"
                >
                  <li>reason1</li>
                </ul>
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="pet-tag" class="text-sm font-semibold"
                  >Tag
                  <span class="text-fg-muted font-normal">· optional</span></label
                ><input
                  data-testid="pet-form-tag"
                  id="pet-tag"
                  class="h-11 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-danger-field-line bg-danger-field"
                  aria-invalid="true"
                  aria-describedby="pet-tag-errors"
                  placeholder="e.g. dog, cat"
                  type="text"
                  value="0001-000"
                />
                <ul
                  id="pet-tag-errors"
                  class="text-danger m-0 list-none p-0 text-[13px]"
                >
                  <li>reason2</li>
                </ul>
              </div>
            </div>
            <div
              role="group"
              aria-labelledby="pet-vaccinations"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center justify-between gap-2">
                <span id="pet-vaccinations" class="text-sm font-semibold"
                  >Vaccinations
                  <span class="text-fg-muted font-normal">(1)</span></span
                ><button
                  data-testid="pet-form-add-vaccination"
                  id="pet-add-vaccination"
                  type="button"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg text-sm"
                >
                  + Add vaccination
                </button>
              </div>
              <ul
                id="pet-vaccinations-errors"
                class="text-danger m-0 list-none p-0 text-[13px]"
              >
                <li>reason3</li>
              </ul>
              <ol class="m-0 flex list-none flex-col gap-2 p-0">
                <li class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <input
                      data-testid="pet-form-vaccinations-0-name"
                      id="pet-vaccination-0"
                      aria-label="Vaccination 1 name"
                      aria-invalid="true"
                      aria-describedby="pet-vaccination-0-errors"
                      class="h-10 flex-1 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-danger-field-line bg-danger-field"
                      type="text"
                      value=""
                    /><button
                      data-testid="pet-form-remove-vaccination-0"
                      aria-label="Remove vaccination 1"
                      type="button"
                      class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-10 rounded-lg px-3 font-medium text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover border-line-control border"
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4h8v2"></path>
                        <path d="M6 6l1 14h10l1-14"></path></svg
                      >Remove
                    </button>
                  </div>
                  <ul
                    id="pet-vaccination-0-errors"
                    class="text-danger m-0 list-none p-0 text-[13px]"
                  >
                    <li>reason4</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
          <div
            class="border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5"
          >
            <span class="flex-1"></span
            ><a
              data-testid="back-to-list"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet"
              data-discover="true"
              ><svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 12H5"></path>
                <path d="m12 19-7-7 7-7"></path></svg
              >Back to list</a
            ><a
              data-testid="pet-form-cancel"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet"
              data-discover="true"
              >Cancel</a
            ><button
              data-testid="pet-form-submit"
              type="submit"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
            >
              Create pet
            </button>
          </div>
        </form>
      </div>
      "
    `);
  });

  test('submit with name', async () => {
    const initialPet = { name: 'Brown', vaccinations: [{ name: 'rabie' }, { name: 'cat cold' }] };
    const submitPetMock = vi.fn((pet: PetRequest) => {
      expect(pet).toEqual({ name: 'Brownie', vaccinations: [{ name: 'rabies' }, { name: 'cat cold' }, { name: '' }] });
    });

    renderInRouter(<PetForm {...defaultProps} initialPet={initialPet} submitPet={submitPetMock} />);

    await userEvent.type(await screen.findByTestId('pet-form-name'), 'ie');
    await userEvent.type(await screen.findByTestId('pet-form-vaccinations-0-name'), 's');

    const addVaccination = await screen.findByTestId('pet-form-add-vaccination');

    await userEvent.click(addVaccination);
    await userEvent.click(addVaccination);

    expect(screen.getByText('Vaccinations').textContent).toBe('Vaccinations (4)');

    await userEvent.click(await screen.findByRole('button', { name: 'Remove vaccination 4' }));

    await userEvent.click(await screen.findByTestId('pet-form-submit'));

    expect(submitPetMock).toHaveBeenCalledTimes(1);
  });

  test('submit with tag', async () => {
    const submitPetMock = vi.fn();

    renderInRouter(<PetForm {...defaultProps} submitPet={submitPetMock} />);

    await userEvent.type(screen.getByLabelText(/Name/), 'Brownie');
    await userEvent.type(screen.getByLabelText(/Tag/), 'dog');
    await userEvent.click(screen.getByRole('button', { name: 'Create pet' }));

    await userEvent.clear(screen.getByLabelText(/Tag/));
    await userEvent.type(screen.getByLabelText(/Name/), '{Enter}');

    expect(submitPetMock).toHaveBeenCalledTimes(2);
    expect(submitPetMock).toHaveBeenNthCalledWith(1, { name: 'Brownie', tag: 'dog', vaccinations: [] });
    expect(submitPetMock).toHaveBeenNthCalledWith(2, { name: 'Brownie', tag: undefined, vaccinations: [] });
  });
});
