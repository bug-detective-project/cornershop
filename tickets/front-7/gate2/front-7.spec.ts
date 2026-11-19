import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { cardOf, cards } from '../../../support/app.ts';

interface Colors {
  /** The first background that is not transparent, from the element up. */
  background: [number, number, number];
  text: [number, number, number];
}

/** The colors an element is painted with, as red, green and blue from 0 to 255. */
function colorsOf(locator: Locator): Promise<Colors> {
  return locator.evaluate((element) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    // Painting a color and reading the pixel back works for every way CSS writes a color.
    const rgba = (color: string): [number, number, number, number] => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [red!, green!, blue!, alpha!];
    };
    let background: [number, number, number, number] = [255, 255, 255, 255];
    for (let current: Element | null = element; current; current = current.parentElement) {
      const color = rgba(getComputedStyle(current).backgroundColor);
      if (color[3] === 255) {
        background = color;
        break;
      }
    }
    const text = rgba(getComputedStyle(element).color);
    return { background: [background[0], background[1], background[2]], text: [text[0], text[1], text[2]] };
  });
}

/** Relative luminance (WCAG): 0 is black, 1 is white. */
function luminance([red, green, blue]: [number, number, number]): number {
  const channel = (value: number) => {
    const share = value / 255;
    return share <= 0.03928 ? share / 12.92 : ((share + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrast(colors: Colors): number {
  const [light, dark] = [luminance(colors.text), luminance(colors.background)].sort((a, b) => b - a);
  return (light! + 0.05) / (dark! + 0.05);
}

/** What the ticket is about: the header, and the parts of a product card. */
function parts(page: Page): [string, Locator][] {
  const card = cardOf(page, 'Sourdough Loaf');
  return [
    ['the header', page.getByRole('banner')],
    ['the shop name in the header', page.getByRole('banner').getByRole('link', { name: 'CornerShop' })],
    ['the Shop link', page.getByRole('banner').getByRole('link', { name: 'Shop', exact: true })],
    ['the Admin link', page.getByRole('banner').getByRole('link', { name: 'Admin', exact: true })],
    ['the card', card],
    ['the name on the card', card.getByTestId('product-name')],
    ['the price on the card', card.getByTestId('product-price')],
    ['the description on the card', card.getByTestId('product-description')],
  ];
}

async function open(page: Page): Promise<void> {
  await page.goto('/?category=bakery');
  await cards(page);
}

test.describe('Ticket front-7: the header and the product cards follow the dark theme', () => {
  test('in the dark theme, the header and the cards are dark and their text is readable', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    for (const [name, locator] of parts(page)) {
      const colors = await colorsOf(locator);
      expect(luminance(colors.background), `${name}: the background must be dark in the dark theme`).toBeLessThan(0.2);
      expect(contrast(colors), `${name}: contrast of the text against its background`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('a card without a photo follows the theme too', async ({ page }) => {
    await page.goto('/?q=Matches');
    await cards(page);
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    const placeholder = cardOf(page, 'Matches').getByText('No photo', { exact: true });

    const colors = await colorsOf(placeholder);
    expect(luminance(colors.background), 'the photo placeholder must be dark in the dark theme').toBeLessThan(0.2);
    expect(contrast(colors), 'contrast of "No photo"').toBeGreaterThanOrEqual(4.5);
  });

  test('in the light theme, the header and the cards stay light and readable', async ({ page }) => {
    await open(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    for (const [name, locator] of parts(page)) {
      const colors = await colorsOf(locator);
      expect(luminance(colors.background), `${name}: the background must be light in the light theme`).toBeGreaterThan(0.8);
      expect(contrast(colors), `${name}: contrast of the text against its background`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('the chosen theme is still there after a reload', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.reload();
    await cards(page);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(luminance((await colorsOf(page.getByRole('banner'))).background)).toBeLessThan(0.2);
    expect(luminance((await colorsOf(cardOf(page, 'Sourdough Loaf'))).background)).toBeLessThan(0.2);
  });
});
