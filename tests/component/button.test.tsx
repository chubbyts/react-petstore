import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ButtonVariant } from '../../src/component/button';
import { AnchorButton, Button, buttonClasses } from '../../src/component/button';

describe('button', () => {
  test.each<[ButtonVariant, string]>([
    ['primary', 'h-11 rounded-control px-4 border border-primary-line bg-primary'],
    ['secondary', 'h-11 rounded-control px-4 border border-line-control bg-surface'],
    ['danger', 'h-11 rounded-control px-4 bg-danger-solid'],
    ['danger-outline', 'h-11 rounded-control px-4 border border-danger font-semibold'],
    ['ghost', 'h-11 rounded-control px-4 font-medium text-fg-muted'],
    ['ghost-danger', 'h-11 rounded-control px-4 font-medium text-fg-muted hover:bg-danger-surface-hover'],
    // square
    ['icon', 'size-11 rounded-control text-fg-muted'],
    ['icon-danger', 'size-11 rounded-control text-fg-muted hover:bg-danger-surface-hover'],
  ])('variant %s', (variant, expected) => {
    expect(buttonClasses({ variant })).toContain(expected);
  });

  test('sizes', () => {
    expect(buttonClasses({ variant: 'secondary', size: 'sm' })).toContain('h-9 rounded-lg px-3');
    expect(buttonClasses({ variant: 'secondary', size: 'md' })).toContain('h-10 rounded-lg px-3');
    expect(buttonClasses({ variant: 'icon', size: 'sm' })).toContain('size-9 rounded-lg');
    expect(buttonClasses({ variant: 'icon-danger', size: 'md' })).toContain('size-10 rounded-lg');
  });

  test('button: type button by default, additional classes', () => {
    render(
      <>
        <Button variant="ghost" className="extra">
          Edit
        </Button>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Edit' }).getAttribute('type')).toBe('button');
    expect(screen.getByRole('button', { name: 'Edit' }).className).toContain('extra');
    expect(screen.getByRole('button', { name: 'Save' }).getAttribute('type')).toBe('submit');
  });

  test('anchor button', () => {
    render(
      <MemoryRouter>
        <AnchorButton to="/pet" variant="secondary" className="extra">
          Back
        </AnchorButton>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Back' });

    expect(link.getAttribute('href')).toBe('/pet');
    expect(link.className).toContain('border-line-control');
    expect(link.className).toContain('extra');
  });
});
