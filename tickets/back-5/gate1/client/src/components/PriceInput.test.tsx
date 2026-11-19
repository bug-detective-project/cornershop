import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, useTransition } from 'react';
import { describe, expect, it } from 'vitest';
import { PriceInput } from './PriceInput.tsx';

/** The field as a page holds it: the price as plain text ("4.50"), shown here next to the field. */
function Holder({ start = '' }: { start?: string }) {
  const [value, setValue] = useState(start);
  return (
    <>
      <label>
        Price
        <PriceInput value={value} onChange={setValue} />
      </label>
      <output data-testid="held">{value}</output>
    </>
  );
}

/** A page that keeps the price where it comes back late, like the URL of the storefront. */
function LateHolder() {
  const [value, setValue] = useState('');
  const [, startTransition] = useTransition();
  return (
    <>
      <label>
        Price
        <PriceInput value={value} onChange={(next) => setTimeout(() => startTransition(() => setValue(next)), 30)} />
      </label>
      <output data-testid="held">{value}</output>
      <button type="button" onClick={() => setValue('')}>
        Clear
      </button>
    </>
  );
}

const field = () => screen.getByRole('textbox', { name: 'Price' });

describe('the price field', () => {
  it('takes the digits from the right, as cents', async () => {
    render(<Holder />);

    await userEvent.type(field(), '4');
    expect(field()).toHaveValue('$0.04');
    await userEvent.type(field(), '5');
    expect(field()).toHaveValue('$0.45');
    await userEvent.type(field(), '0');
    expect(field()).toHaveValue('$4.50');
    expect(screen.getByTestId('held')).toHaveTextContent('4.50');
  });

  it('groups the thousands and ignores what is not a digit', async () => {
    render(<Holder />);

    await userEvent.type(field(), '12a3.4-56');

    expect(field()).toHaveValue('$1,234.56');
    expect(screen.getByTestId('held')).toHaveTextContent('1234.56');
  });

  it('takes the last digit out with Backspace, and empties when none is left', async () => {
    render(<Holder start="4.50" />);
    expect(field()).toHaveValue('$4.50');

    await userEvent.type(field(), '{Backspace}');
    expect(field()).toHaveValue('$0.45');
    await userEvent.type(field(), '{Backspace}{Backspace}');
    expect(field()).toHaveValue('');
    expect(screen.getByTestId('held')).toHaveTextContent('');
  });

  it('stops at the largest price the shop takes', async () => {
    render(<Holder />);

    await userEvent.type(field(), '12345678901');

    expect(field()).toHaveValue('$1,234,567.89');
  });

  it('shows the number keys on a phone', () => {
    render(<Holder />);

    expect(field()).toHaveAttribute('inputmode', 'numeric');
  });

  it('loses no digit when the page gives the price back late, and still shows a change from outside', async () => {
    render(<LateHolder />);

    await userEvent.type(field(), '1250');
    expect(field()).toHaveValue('$12.50');
    // Every late answer is in before the change from outside, so none of them can undo it.
    await waitFor(() => expect(screen.getByTestId('held')).toHaveTextContent('12.50'));

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    await waitFor(() => expect(field()).toHaveValue(''));
  });
});
