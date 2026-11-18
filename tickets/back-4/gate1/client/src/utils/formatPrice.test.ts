import { describe, expect, it } from 'vitest';
import { formatPrice } from './formatPrice.ts';

describe('formatPrice', () => {
  it.each([
    [450, '$4.50'],
    [95, '$0.95'],
    [0, '$0.00'],
    [12900, '$129.00'],
    [123456, '$1,234.56'],
  ])('shows %i cents as %s', (cents, text) => {
    expect(formatPrice(cents)).toBe(text);
  });
});
