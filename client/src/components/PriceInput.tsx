import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { formatPrice, parsePrice } from '../utils/formatPrice.ts';

/** The most digits a price can have: up to 7 before the point and 2 after, as `parsePrice` takes it. */
const MAX_DIGITS = 9;

/** Cents as the plain text the pages keep ("4.50"). */
const asText = (cents: number) => `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;

type PriceInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'inputMode'> & {
  /** The price as plain text ("4.50"), or "" when there is none. */
  value: string;
  onChange: (value: string) => void;
};

/**
 * A field for a price in dollars, with a mask: the digits come in from the right, as cents (4, 5, 0
 * shows $4.50), anything else is ignored, and Backspace takes the last digit out. The page keeps the
 * price as plain text, the way `parsePrice` reads it.
 *
 * While the field has the focus, what was typed is what it shows: a page that keeps the price in the
 * URL gets it back a moment later (the router updates it in a transition), and showing that older
 * value under a fast typist would lose digits. A change from outside (a link, Clear filters) shows
 * when the field is not being typed in.
 */
export function PriceInput({ value, onChange, onFocus, onBlur, ...field }: PriceInputProps) {
  const [typed, setTyped] = useState(value);
  const [focused, setFocused] = useState(false);
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (!focused) {
      setTyped(value);
    }
  }

  const cents = parsePrice(typed);
  const shown = typed === '' ? '' : cents === undefined ? typed : formatPrice(cents);

  return (
    <input
      {...field}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={shown}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        setTyped(value);
        onBlur?.(event);
      }}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_DIGITS);
        const next = digits === '' ? '' : asText(Number(digits));
        setTyped(next);
        onChange(next);
      }}
    />
  );
}
