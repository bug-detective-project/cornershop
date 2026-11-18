import { expect, test } from '@playwright/test';
import { cardOf, cards, productNamed } from '../../../support/app.ts';

test.describe('Ticket front-8: the product page', () => {
  test('opens from a card of the storefront, at /products/<id>', async ({ page, request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');
    await page.goto('/?category=bakery');
    await cards(page);

    await cardOf(page, 'Sourdough Loaf').getByRole('link', { name: 'Sourdough Loaf' }).click();

    await expect(page).toHaveURL(new RegExp(`/products/${loaf.id}$`));
    await expect(page.getByRole('heading', { level: 1, name: 'Sourdough Loaf' })).toBeVisible();
  });

  test('shows the name, the price, the category, the stock and the description', async ({ page, request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');
    await page.goto(`/products/${loaf.id}`);

    await expect(page.getByRole('heading', { level: 1, name: 'Sourdough Loaf' })).toBeVisible();
    await expect(page.getByTestId('product-price')).toHaveText('$4.50');
    await expect(page.getByText('Bakery', { exact: true })).toBeVisible();
    await expect(page.getByText('In stock', { exact: true })).toBeVisible();
    await expect(page.getByText(loaf.description, { exact: true })).toBeVisible();
  });

  test('says "Out of stock" for a product with no stock', async ({ page, request }) => {
    const fish = await productNamed(request, 'Fish Fingers');
    await page.goto(`/products/${fish.id}`);

    await expect(page.getByRole('heading', { level: 1, name: 'Fish Fingers' })).toBeVisible();
    await expect(page.getByText('Out of stock', { exact: true })).toBeVisible();
    await expect(page.getByText('In stock', { exact: true })).toHaveCount(0);
  });

  test('the gallery shows the first photo and one thumbnail button per photo', async ({ page, request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');
    await page.goto(`/products/${loaf.id}`);

    const main = page.getByTestId('gallery-main');
    await expect(main).toHaveAttribute('src', loaf.images[0]!);
    await expect(main).toHaveAttribute('alt', 'Sourdough Loaf');
    await expect(page.getByRole('button', { name: /^Show photo \d+$/ })).toHaveCount(3);
    // The picture really loaded.
    await expect.poll(() => main.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  });

  test('clicking a thumbnail shows that photo', async ({ page, request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');
    await page.goto(`/products/${loaf.id}`);
    const main = page.getByTestId('gallery-main');
    await expect(main).toHaveAttribute('src', loaf.images[0]!);

    await page.getByRole('button', { name: 'Show photo 2', exact: true }).click();
    await expect(main).toHaveAttribute('src', loaf.images[1]!);

    await page.getByRole('button', { name: 'Show photo 3', exact: true }).click();
    await expect(main).toHaveAttribute('src', loaf.images[2]!);

    await page.getByRole('button', { name: 'Show photo 1', exact: true }).click();
    await expect(main).toHaveAttribute('src', loaf.images[0]!);
  });

  test('a product without photos shows "No photos yet"', async ({ page, request }) => {
    const matches = await productNamed(request, 'Matches');
    await page.goto(`/products/${matches.id}`);

    await expect(page.getByRole('heading', { level: 1, name: 'Matches' })).toBeVisible();
    await expect(page.getByText('No photos yet', { exact: true })).toBeVisible();
    await expect(page.getByTestId('gallery-main')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Show photo/ })).toHaveCount(0);
  });

  test('a product that does not exist shows "Product not found" and a way back', async ({ page }) => {
    await page.goto('/products/999999');

    await expect(page.getByRole('heading', { name: 'Product not found' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to the shop' }).click();
    await expect(page).toHaveURL(/\/$/);
    await cards(page);
  });

  test('has a link back to the shop', async ({ page, request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');
    await page.goto(`/products/${loaf.id}`);

    await page.getByRole('link', { name: 'Back to the shop' }).click();

    await expect(page).toHaveURL(/\/$/);
    await cards(page);
  });
});
