import { test, expect, vi, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Routes from '../src/routes';
import { formatHtml } from './formatter';

vi.mock('../src/component/page/home', () => {
  return {
    default: () => <div data-testid="page-home-mock" />,
  };
});

vi.mock('../src/component/page/pet/list', () => {
  return {
    default: () => <div data-testid="page-pet-list-mock" />,
  };
});

vi.mock('../src/component/page/pet/create', () => {
  return {
    default: () => <div data-testid="page-pet-create-mock" />,
  };
});

vi.mock('../src/component/page/pet/read', () => {
  return {
    default: () => <div data-testid="page-pet-read-mock" />,
  };
});

vi.mock('../src/component/page/pet/update', () => {
  return {
    default: () => <div data-testid="page-pet-update-mock" />,
  };
});

vi.mock('../src/component/page/not-found', () => {
  return {
    default: () => <div data-testid="page-not-found-mock" />,
  };
});

describe('routes', () => {
  test('home page', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-home-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-home-mock"></div></div>
    "
  `);
  });

  test('not found', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/some-unknown-page']}>
        <Routes />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-not-found-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-not-found-mock"></div></div>
    "
  `);
  });

  test('pet list', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pet']}>
        <Routes />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-pet-list-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-pet-list-mock"></div></div>
    "
  `);
  });

  test('pet create', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pet/create']}>
        <Routes />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-pet-create-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-pet-create-mock"></div></div>
    "
  `);
  });

  test('pet read', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9']}>
        <Routes />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-pet-read-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-pet-read-mock"></div></div>
    "
  `);
  });

  test('pet update', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update']}>
        <Routes />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-pet-update-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-pet-update-mock"></div></div>
    "
  `);
  });
});
