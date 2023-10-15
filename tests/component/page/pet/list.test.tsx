import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import List from '../../../../src/component/page/pet/list';
import { PetFilterFormProps } from '../../../../src/component/form/pet-filter-form';
import userEvent from '@testing-library/user-event';
import { beforeEach, vi } from 'vitest';
import { test, expect } from 'vitest';
import { PetList } from '../../../../src/model/model';
import { formatHtml } from '../../../formatter';
import { BadRequest, HttpError, NotFound } from '../../../../src/api-client/error';
import { PaginationProps } from '../../../../src/component/partial/pagination';

let mockListPets = (queryString: string) => { };
let mockDeletePet = (id: string) => { };

vi.mock('../../../../src/api-client/pet', () => {
  return {
    ListPets: (queryString: string) => {
      return mockListPets(queryString);
    },
    DeletePet: (id: string) => {
      return mockDeletePet(id);
    },
  };
});

beforeEach(() => {
  mockListPets = (queryString: string) => { };
  mockDeletePet = (id: string) => { };
});

vi.mock('../../../../src/component/form/pet-filter-form', () => {
  return {
    PetFilterForm: ({ submitPetFilter }: PetFilterFormProps) => {
      const onSubmit = () => {
        submitPetFilter({ name: 'Bro' });
      };

      return <button data-testid="test-filter-button" onClick={onSubmit}></button>;
    },
  };
});

vi.mock('../../../../src/component/partial/http-error', () => {
  return {
    HttpError: ({ httpError }: { httpError: HttpError; }) => {
      return <div>httpError: {httpError.title}</div>;
    },
  };
});

vi.mock('../../../../src/component/partial/pagination', () => {
  return {
    Pagination: ({ submitPage, currentPage, totalPages, maxPages }: PaginationProps) => {
      const submit = () => {
        submitPage(2);
      };

      return (
        <button
          data-testid="test-pagination-button"
          data-current-page={currentPage}
          data-total-pages={totalPages}
          data-max-pages={maxPages}
          onClick={submit}
        ></button>
      );
    },
  };
});

test('bad request', async () => {
  mockListPets = async (queryString: string) => {
    return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'title' })));
  };

  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-list\\">
        <div>httpError: title</div>
        <h1>List Pets</h1>
      </div>
    </div>
    "
  `);
});

test('default', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-list\\">
        <h1>List Pets</h1>
        <div>
          <a class=\\"btn-green mb-4\\" href=\\"/pet/create\\">Create</a
          ><button data-testid=\\"test-filter-button\\"></button>
          <table class=\\"my-4\\">
            <thead>
              <tr>
                <th>Id</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>
                  Name (<a
                    data-testid=\\"sort-pet-name-asc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=asc\\"
                  >
                    A-Z
                  </a>
                  |<a
                    data-testid=\\"sort-pet-name-desc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=desc\\"
                  >
                    Z-A
                  </a>
                  |<a data-testid=\\"sort-pet-name--\\" href=\\"/pet?page=1\\"> --- </a>)
                </th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                <td>15.08.2005 - 17:52:01</td>
                <td>15.08.2005 - 17:55:01</td>
                <td>Brownie</td>
                <td>0001-000</td>
                <td>
                  <a
                    class=\\"btn-gray mr-4\\"
                    href=\\"/pet/4d783b77-eb09-4603-b99b-f590b605eaa9\\"
                    >Read</a
                  ><a
                    class=\\"btn-gray mr-4\\"
                    href=\\"/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update\\"
                    >Update</a
                  ><button data-testid=\\"remove-pet-0\\" class=\\"btn-red\\">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            data-testid=\\"test-pagination-button\\"
            data-current-page=\\"1\\"
            data-total-pages=\\"2\\"
            data-max-pages=\\"7\\"
          ></button>
        </div>
      </div>
    </div>
    "
  `);
});

test('no actions', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {},
        },
      ],
    },
    _links: {},
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-list\\">
        <h1>List Pets</h1>
        <div>
          <button data-testid=\\"test-filter-button\\"></button>
          <table class=\\"my-4\\">
            <thead>
              <tr>
                <th>Id</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>
                  Name (<a
                    data-testid=\\"sort-pet-name-asc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=asc\\"
                  >
                    A-Z
                  </a>
                  |<a
                    data-testid=\\"sort-pet-name-desc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=desc\\"
                  >
                    Z-A
                  </a>
                  |<a data-testid=\\"sort-pet-name--\\" href=\\"/pet?page=1\\"> --- </a>)
                </th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                <td>15.08.2005 - 17:52:01</td>
                <td>15.08.2005 - 17:55:01</td>
                <td>Brownie</td>
                <td>0001-000</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <button
            data-testid=\\"test-pagination-button\\"
            data-current-page=\\"1\\"
            data-total-pages=\\"2\\"
            data-max-pages=\\"7\\"
          ></button>
        </div>
      </div>
    </div>
    "
  `);
});

test('submit bad request', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  const { container, rerender } = render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  mockListPets = async (queryString: string) => {
    return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'title' })));
  };

  const testButton = await screen.findByTestId('test-filter-button');

  await userEvent.click(testButton);

  expect(history.location.pathname).toBe('/pet');
  expect(history.location.search).toBe('?page=1&filters%5Bname%5D=Bro');

  rerender(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByText(/httpError/);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-list\\">
        <div>httpError: title</div>
        <h1>List Pets</h1>
        <div>
          <a class=\\"btn-green mb-4\\" href=\\"/pet/create\\">Create</a
          ><button data-testid=\\"test-filter-button\\"></button>
          <table class=\\"my-4\\">
            <thead>
              <tr>
                <th>Id</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>
                  Name (<a
                    data-testid=\\"sort-pet-name-asc\\"
                    href=\\"/pet?page=1&amp;filters%5Bname%5D=Bro&amp;sort%5Bname%5D=asc\\"
                  >
                    A-Z
                  </a>
                  |<a
                    data-testid=\\"sort-pet-name-desc\\"
                    href=\\"/pet?page=1&amp;filters%5Bname%5D=Bro&amp;sort%5Bname%5D=desc\\"
                  >
                    Z-A
                  </a>
                  |<a
                    data-testid=\\"sort-pet-name--\\"
                    href=\\"/pet?page=1&amp;filters%5Bname%5D=Bro\\"
                  >
                    --- </a
                  >)
                </th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                <td>15.08.2005 - 17:52:01</td>
                <td>15.08.2005 - 17:55:01</td>
                <td>Brownie</td>
                <td>0001-000</td>
                <td>
                  <a
                    class=\\"btn-gray mr-4\\"
                    href=\\"/pet/4d783b77-eb09-4603-b99b-f590b605eaa9\\"
                    >Read</a
                  ><a
                    class=\\"btn-gray mr-4\\"
                    href=\\"/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update\\"
                    >Update</a
                  ><button data-testid=\\"remove-pet-0\\" class=\\"btn-red\\">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            data-testid=\\"test-pagination-button\\"
            data-current-page=\\"1\\"
            data-total-pages=\\"2\\"
            data-max-pages=\\"7\\"
          ></button>
        </div>
      </div>
    </div>
    "
  `);
});

test('submit filter', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  const testButton = await screen.findByTestId('test-filter-button');

  await userEvent.click(testButton);

  expect(history.location.pathname).toBe('/pet');
  expect(history.location.search).toBe('?page=1&filters%5Bname%5D=Bro');
});

test('sort', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  expect(history.location.pathname).toBe('/');

  const sortNameDescLink = await screen.findByTestId('sort-pet-name-desc');

  await userEvent.click(sortNameDescLink);

  expect(history.location.pathname).toBe('/pet');
  expect(history.location.search).toBe('?page=1&sort%5Bname%5D=desc');
});

test('next', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  expect(history.location.pathname).toBe('/');

  const testButton = await screen.findByTestId('test-pagination-button');

  await userEvent.click(testButton);

  expect(history.location.pathname).toBe('/pet');
  expect(history.location.search).toBe('?page=2');
});

test('delete not found', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  mockDeletePet = async (id: string) => {
    return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
  };

  const removePetButton = await screen.findByTestId('remove-pet-0');

  await userEvent.click(removePetButton);

  await screen.findByText(/httpError/);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-list\\">
        <div>httpError: title</div>
        <h1>List Pets</h1>
        <div>
          <a class=\\"btn-green mb-4\\" href=\\"/pet/create\\">Create</a
          ><button data-testid=\\"test-filter-button\\"></button>
          <table class=\\"my-4\\">
            <thead>
              <tr>
                <th>Id</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>
                  Name (<a
                    data-testid=\\"sort-pet-name-asc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=asc\\"
                  >
                    A-Z
                  </a>
                  |<a
                    data-testid=\\"sort-pet-name-desc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=desc\\"
                  >
                    Z-A
                  </a>
                  |<a data-testid=\\"sort-pet-name--\\" href=\\"/pet?page=1\\"> --- </a>)
                </th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4d783b77-eb09-4603-b99b-f590b605eaa9</td>
                <td>15.08.2005 - 17:52:01</td>
                <td>15.08.2005 - 17:55:01</td>
                <td>Brownie</td>
                <td>0001-000</td>
                <td>
                  <a
                    class=\\"btn-gray mr-4\\"
                    href=\\"/pet/4d783b77-eb09-4603-b99b-f590b605eaa9\\"
                    >Read</a
                  ><a
                    class=\\"btn-gray mr-4\\"
                    href=\\"/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update\\"
                    >Update</a
                  ><button data-testid=\\"remove-pet-0\\" class=\\"btn-red\\">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            data-testid=\\"test-pagination-button\\"
            data-current-page=\\"1\\"
            data-total-pages=\\"2\\"
            data-max-pages=\\"7\\"
          ></button>
        </div>
      </div>
    </div>
    "
  `);
});

test('delete success', async () => {
  const petList = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petList));
  };

  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <List />
    </Router>,
  );

  await screen.findByTestId('page-pet-list');

  mockDeletePet = async (id: string) => {
    return new Promise((resolve) => resolve());
  };

  const petListNoItem = {
    offset: 0,
    limit: 1,
    count: 2,
    _embedded: {
      items: [],
    },
    _links: {
      create: {
        href: '/api/pets',
        attributes: {
          method: 'POST',
        },
      },
    },
  };

  mockListPets = async (queryString: string) => {
    return new Promise<PetList>((resolve) => resolve(petListNoItem));
  };

  const removePetButton = await screen.findByTestId('remove-pet-0');

  await userEvent.click(removePetButton);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-list\\">
        <h1>List Pets</h1>
        <div>
          <a class=\\"btn-green mb-4\\" href=\\"/pet/create\\">Create</a
          ><button data-testid=\\"test-filter-button\\"></button>
          <table class=\\"my-4\\">
            <thead>
              <tr>
                <th>Id</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>
                  Name (<a
                    data-testid=\\"sort-pet-name-asc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=asc\\"
                  >
                    A-Z
                  </a>
                  |<a
                    data-testid=\\"sort-pet-name-desc\\"
                    href=\\"/pet?page=1&amp;sort%5Bname%5D=desc\\"
                  >
                    Z-A
                  </a>
                  |<a data-testid=\\"sort-pet-name--\\" href=\\"/pet?page=1\\"> --- </a>)
                </th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <button
            data-testid=\\"test-pagination-button\\"
            data-current-page=\\"1\\"
            data-total-pages=\\"2\\"
            data-max-pages=\\"7\\"
          ></button>
        </div>
      </div>
    </div>
    "
  `);
});
