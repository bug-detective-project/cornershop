const DOLLARS = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Prices travel as whole cents; this is the only place that turns them into text. */
export function formatPrice(cents: number): string {
  return DOLLARS.format(cents / 100);
}

/** What the shopper or the owner typed ("4.50", "4", "$4.5") as cents, or undefined when it is not a price. */
export function parsePrice(text: string): number | undefined {
  const match = /^\$?(\d{1,7})(?:\.(\d{1,2}))?$/.exec(text.trim());
  if (!match) {
    return undefined;
  }
  return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
}
