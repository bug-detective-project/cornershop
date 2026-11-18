import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Header } from './Header.tsx';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe('the header', () => {
  it('is switched by the header button, and remembered', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const toggle = screen.getByRole('button', { name: 'Toggle theme' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(toggle);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('cornershop-theme')).toBe('dark');

    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('links to the shop and to the owner panel', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
  });
});
