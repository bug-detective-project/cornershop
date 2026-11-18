import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

// What each ticket of the game breaks is tested in a file of its own (Storefront.category,
// Storefront.details, the layout and theme tests of the components): the tests here hold for
// every ticket.

const cards = () => screen.findAllByTestId('product-card');
const namesShown = async () => (await cards()).map((card) => within(card).getByTestId('product-name').textContent);
const lastListRequest = (requests: ReturnType<typeof mockApi>['requests']) => requests.filter((request) => request.path === '/api/products').at(-1)!.search;

describe('the storefront', () => {
  it('shows the products with their price and a link to their page', async () => {
    mockApi();
    renderApp('/');

    expect(await namesShown()).toEqual(['Aged Cheddar', 'Butter Croissant', 'Sourdough Loaf', 'Umbrella', 'Whole Milk']);
    const loaf = (await cards())[2]!;
    expect(within(loaf).getByTestId('product-price')).toHaveTextContent('$4.50');
    expect(within(loaf).getByRole('link', { name: 'Sourdough Loaf' })).toHaveAttribute('href', '/products/1');
    expect(within(loaf).getByRole('img', { name: 'Sourdough Loaf' })).toHaveAttribute('src', '/images/loaf-1.svg');
  });

  it('asks the API for pages of twelve', async () => {
    const { requests } = mockApi();
    renderApp('/');
    await cards();

    expect(lastListRequest(requests).get('pageSize')).toBe('12');
  });

  it('searches as the shopper types, and keeps the search in the URL', async () => {
    mockApi();
    renderApp('/');
    await cards();

    await userEvent.type(screen.getByLabelText('Search'), 'milk');

    await waitFor(async () => expect(await namesShown()).toEqual(['Whole Milk']));
    expect(screen.getByTestId('location')).toHaveTextContent('/?q=milk');
  });

  it('reads the search and the order from the URL', async () => {
    const { requests } = mockApi();
    renderApp('/?q=o&sort=price_desc');

    expect(await namesShown()).toEqual(['Sourdough Loaf', 'Butter Croissant', 'Whole Milk']);
    expect(screen.getByLabelText('Search')).toHaveValue('o');
    expect(screen.getByLabelText('Sort by')).toHaveValue('price_desc');
    expect(lastListRequest(requests).get('sort')).toBe('price_desc');
  });

  it('sorts by the chosen order', async () => {
    mockApi();
    renderApp('/');
    await cards();

    await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'Price: low to high');

    await waitFor(async () => expect((await namesShown())[0]).toBe('Whole Milk'));
    expect(screen.getByTestId('location')).toHaveTextContent('/?sort=price_asc');
  });

  it('filters by a price range typed in dollars, sent in cents', async () => {
    const { requests } = mockApi();
    renderApp('/');
    await cards();

    await userEvent.type(screen.getByLabelText('Min price'), '2');
    await userEvent.type(screen.getByLabelText('Max price'), '7.50');

    await waitFor(async () => expect(await namesShown()).toEqual(['Aged Cheddar', 'Butter Croissant', 'Sourdough Loaf']));
    expect(lastListRequest(requests).get('minPrice')).toBe('200');
    expect(lastListRequest(requests).get('maxPrice')).toBe('750');
  });

  it('says so when nothing matches', async () => {
    mockApi();
    renderApp('/?q=zzz');

    expect(await screen.findByText('No products match these filters.')).toBeInTheDocument();
  });

  it('says so when the products cannot be loaded', async () => {
    mockApi({ respond: (request) => (request.path === '/api/products' ? new Response('{}', { status: 500 }) : undefined) });
    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent('The products could not be loaded.');
  });

  it('moves between pages and keeps the page in the URL', async () => {
    const many = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      name: `Product ${String(index + 1).padStart(2, '0')}`,
      description: '',
      priceCents: 100 + index,
      stock: 1,
      category: null,
      images: [],
      createdAt: '2026-01-05T09:00:00.000Z',
    }));
    mockApi({ products: many });
    renderApp('/');

    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByText('Page 2 of 3')).toBeInTheDocument();
    expect((await namesShown())[0]).toBe('Product 13');
    expect(screen.getByTestId('location')).toHaveTextContent('/?page=2');

    await userEvent.type(screen.getByLabelText('Search'), '0');
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/?q=0'));
  });

  it('shows a page for an address that does not exist', async () => {
    mockApi();
    renderApp('/nowhere');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the shop' })).toHaveAttribute('href', '/');
  });
});
