import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { appRootId, DeleteDialog, mainId } from '../../../src/component/partial/delete-dialog';

const createElement = (tag: string, id: string): HTMLElement => {
  const element = document.createElement(tag);
  element.setAttribute('id', id);
  document.body.appendChild(element);

  return element;
};

describe('delete-dialog', () => {
  afterEach(() => {
    document.getElementById(appRootId)?.remove();
    document.getElementById(mainId)?.remove();
  });

  test('modal: app inert, focus on cancel, focus back to the opener', async () => {
    const appRoot = createElement('div', appRootId);
    const opener = document.createElement('button');
    appRoot.appendChild(opener);
    act(() => opener.focus());

    const onCancel = vi.fn();

    const { unmount } = render(
      <DeleteDialog name="Brownie" isPending={false} onCancel={onCancel} onConfirm={() => {}} />,
    );

    const dialog = screen.getByRole('alertdialog', { name: 'Delete Brownie?' });

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    // rendered outside of the app, which is inert
    expect(appRoot.contains(dialog)).toBe(false);
    expect(appRoot.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));

    // other keys don't close the dialog
    await userEvent.keyboard('a');
    expect(onCancel).not.toHaveBeenCalled();

    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);

    unmount();

    expect(appRoot.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  test('escape also closes when the focus left the dialog (e.g. a click on the backdrop)', async () => {
    const onCancel = vi.fn();

    render(<DeleteDialog name="Brownie" isPending={false} onCancel={onCancel} onConfirm={() => {}} />);

    act(() => (document.activeElement as HTMLElement).blur());
    expect(document.activeElement).toBe(document.body);

    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('focus to the content if the opener is gone (e.g. the deleted row)', () => {
    const main = createElement('main', mainId);
    main.setAttribute('tabindex', '-1');
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    act(() => opener.focus());

    const { unmount } = render(
      <DeleteDialog name="Brownie" isPending={false} onCancel={() => {}} onConfirm={() => {}} />,
    );

    opener.remove();
    unmount();

    expect(document.activeElement).toBe(main);
  });

  test('without app root, opener and main', () => {
    const { unmount } = render(<DeleteDialog name="Brownie" isPending onCancel={() => {}} onConfirm={() => {}} />);

    expect((screen.getByRole('button', { name: 'Delete pet' }) as HTMLButtonElement).disabled).toBe(true);

    act(() => (document.activeElement as HTMLElement).blur());

    expect(() => unmount()).not.toThrow();
  });
});
