import { expect, test } from '@playwright/test';
import { cards, listProducts, namesShown } from '../../../support/app.ts';

test.describe('Ticket back-3: every page shows different products', () => {
  for (const pageSize of [12, 5, 25]) {
    test(`with ${pageSize} per page, walking the pages gives every product exactly once`, async ({ request }) => {
      const { total } = await listProducts(request, { pageSize });
      const seen: number[] = [];
      for (let page = 1; page <= Math.ceil(total / pageSize); page += 1) {
        const result = await listProducts(request, { pageSize, page });
        expect(result.total).toBe(total);
        expect(result.pageSize).toBe(pageSize);
        seen.push(...result.items.map((item) => item.id));
      }

      expect(new Set(seen).size, 'no product may come twice').toBe(seen.length);
      expect(seen, 'no product may be left out').toHaveLength(total);
    });
  }

  test('page 2 of twelve starts right after page 1', async ({ request }) => {
    const all = (await listProducts(request, { pageSize: 24 })).items.map((item) => item.name);

    expect((await listProducts(request, { pageSize: 12 })).items.map((item) => item.name)).toEqual(all.slice(0, 12));
    expect((await listProducts(request, { pageSize: 12, page: 2 })).items.map((item) => item.name)).toEqual(all.slice(12, 24));
  });

  test('the default page size still works', async ({ request }) => {
    const first = (await listProducts(request)).items.map((item) => item.id);
    const second = (await listProducts(request, { page: 2 })).items.map((item) => item.id);

    expect(first).toHaveLength(10);
    expect(second).toHaveLength(10);
    expect(first.filter((id) => second.includes(id))).toEqual([]);
  });

  test('pages work inside a category too', async ({ request }) => {
    const whole = (await listProducts(request, { category: 'bakery', pageSize: 50 })).items.map((item) => item.id);

    expect((await listProducts(request, { category: 'bakery', pageSize: 3, page: 2 })).items.map((item) => item.id)).toEqual(whole.slice(3, 6));
    expect((await listProducts(request, { category: 'bakery', pageSize: 3, page: 3 })).items.map((item) => item.id)).toEqual(whole.slice(6, 7));
  });

  test('in the storefront, page 2 repeats nothing from page 1', async ({ page }) => {
    await page.goto('/');
    await cards(page);
    const first = await namesShown(page);
    expect(first).toHaveLength(12);

    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText('Page 2 of 5')).toBeVisible();
    await expect.poll(async () => (await namesShown(page))[0]).not.toBe(first[0]);
    const second = await namesShown(page);

    expect(second.filter((name) => first.includes(name)), 'products on both pages').toEqual([]);
  });
});
