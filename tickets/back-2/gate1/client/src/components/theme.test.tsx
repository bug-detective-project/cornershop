import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestProducts } from '../test/mockApi.ts';
import { Header } from './Header.tsx';
import { ProductCard } from './ProductCard.tsx';

/** Colors of one fixed theme: they do not change with data-theme. */
const FIXED_COLOR = /^(bg|text|border)-(white|black|(slate|gray|zinc|neutral|stone)-\d+)$/;
/**
 * Classes with a dark: variant are a way of following the theme too. The dots that pick a photo sit
 * on the photo itself, so they are white in both themes on purpose.
 */
const fixedColors = (root: HTMLElement) =>
  [root, ...root.querySelectorAll<HTMLElement>('*')].filter((element) => !element.closest('[aria-label^="Photos of"]')).flatMap((element) => {
    const names = [...element.classList];
    return names.filter((name) => FIXED_COLOR.test(name) && !names.some((other) => other.startsWith(`dark:${name.split('-')[0]}-`)));
  });

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe('the colors of the theme', () => {
  it('colors the header with the theme tokens, not with fixed colors', () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(fixedColors(container)).toEqual([]);
  });

  it('colors the product card with the theme tokens, not with fixed colors', () => {
    const { container } = render(
      <MemoryRouter>
        <ProductCard product={createTestProducts()[0]!} />
      </MemoryRouter>,
    );

    expect(fixedColors(container)).toEqual([]);
  });
});
