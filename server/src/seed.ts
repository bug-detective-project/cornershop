import type { Db } from './db.ts';
import { categories, productImages, products } from './schema.ts';

/** name | price in cents | stock | number of photos (1 when left out) */
type Line = `${string} | ${number} | ${number}` | `${string} | ${number} | ${number} | ${number}`;

interface Shelf {
  name: string;
  slug: string;
  /** What the description says about everything on this shelf. */
  about: string;
  items: Line[];
}

const SHELVES: Shelf[] = [
  {
    name: 'Bakery',
    slug: 'bakery',
    about: 'Baked this morning in the back of the shop.',
    items: [
      'Sourdough Loaf | 450 | 12 | 3',
      'Grandma Lucia\'s Slow-Fermented Whole Wheat Sourdough Country Loaf (Large) | 890 | 4 | 2',
      'Butter Croissant | 275 | 18',
      'Cinnamon Roll | 325 | 9',
      'Seeded Rye Bread | 520 | 6',
      'Blueberry Muffin | 295 | 14',
      'Baguette | 310 | 20 | 2',
    ],
  },
  {
    name: 'Dairy',
    slug: 'dairy',
    about: 'Kept cold and delivered twice a week from farms nearby.',
    items: [
      'Whole Milk 1 L | 189 | 30',
      'Salted Butter | 399 | 16',
      'Aged Cheddar | 725 | 8 | 2',
      'Greek Yogurt | 349 | 22',
      'Free-Range Eggs (12) | 549 | 15',
      'Fresh Mozzarella | 475 | 0',
      'Sour Cream | 259 | 11 | 0',
    ],
  },
  {
    name: 'Produce',
    slug: 'produce',
    about: 'Picked for ripeness and restocked every morning.',
    items: [
      'Bananas (bunch) | 199 | 25',
      'Honeycrisp Apples (4) | 450 | 17',
      'Vine Tomatoes | 380 | 13',
      'Baby Spinach | 325 | 9',
      'Lemons (3) | 249 | 21',
      'Avocado | 189 | 0',
      'Red Onions (1 kg) | 275 | 19 | 0',
    ],
  },
  {
    name: 'Pantry',
    slug: 'pantry',
    about: 'A staple for the cupboard, with a long shelf life.',
    items: [
      'Extra Virgin Olive Oil | 1290 | 10 | 2',
      'Spaghetti 500 g | 219 | 40',
      'Arborio Rice | 499 | 12',
      'Tomato Passata | 289 | 24',
      'Sea Salt Flakes | 450 | 15',
      'Wildflower Honey | 895 | 7',
      'Rolled Oats | 349 | 18 | 0',
    ],
  },
  {
    name: 'Drinks',
    slug: 'drinks',
    about: 'Best served cold; ask at the counter for a chilled one.',
    items: [
      'Sparkling Water 1 L | 149 | 36',
      'Cold Brew Coffee | 425 | 10',
      'Orange Juice | 499 | 14 | 2',
      'Ginger Kombucha | 475 | 8',
      'Oat Drink | 329 | 16',
      'Lemonade | 289 | 0',
      'Gift Hamper with Sparkling Wine | 12900 | 2 | 3',
    ],
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    about: 'Something small for the way home.',
    items: [
      'Sea Salt Crisps | 229 | 28',
      'Dark Chocolate 70% | 395 | 19',
      'Roasted Almonds | 649 | 11',
      'Oat Cookies | 349 | 13',
      'Chewing Gum | 95 | 50 | 0',
      'Trail Mix | 575 | 9',
      'Rice Crackers | 259 | 17',
    ],
  },
  {
    name: 'Household',
    slug: 'household',
    about: 'An everyday item for the home.',
    items: [
      'Dish Soap | 349 | 14',
      'Paper Towels (2) | 425 | 20',
      'Laundry Detergent | 1150 | 6',
      'Sponges (3) | 219 | 23 | 0',
      'Bin Bags (20) | 389 | 12',
      'Beeswax Candle | 950 | 5 | 2',
    ],
  },
  {
    name: 'Frozen',
    slug: 'frozen',
    about: 'Keep frozen; bring a cool bag in summer.',
    items: [
      'Vanilla Ice Cream | 695 | 9',
      'Garden Peas | 249 | 22',
      'Margherita Pizza | 599 | 10 | 2',
      'Fish Fingers | 549 | 0',
      'Mixed Berries | 625 | 8',
      'Puff Pastry | 399 | 12 | 0',
    ],
  },
];

/** New on the shelves, and the owner has not filed them under a category yet. */
const UNSORTED: Line[] = [
  'Reusable Tote Bag | 450 | 30',
  'Local Newspaper | 250 | 12 | 0',
  'Birthday Card | 395 | 16',
  'Phone Charging Cable | 1150 | 4',
  'Matches | 120 | 40 | 0',
  'Umbrella | 1890 | 3',
];

const fileName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** The first product was added at this moment and each next one a minute later, so "newest" has one answer. */
const FIRST_CREATED_AT = Date.UTC(2026, 0, 5, 9, 0, 0);

/** Inserts the sample shop into an empty database: always the same rows, in the same order. */
export async function seedDatabase(db: Db): Promise<void> {
  const shelves = await db
    .insert(categories)
    .values(SHELVES.map(({ name, slug }) => ({ name, slug })))
    .returning();

  const lines = [
    ...SHELVES.flatMap((shelf, index) => shelf.items.map((line) => ({ line, about: shelf.about, categoryId: shelves[index]!.id as number | null }))),
    ...UNSORTED.map((line) => ({ line, about: 'New in the shop this week.', categoryId: null })),
  ];
  const parsed = lines.map(({ line, about, categoryId }, index) => {
    const [name, price, stock, photos = '1'] = line.split(' | ') as [string, string, string, string?];
    return {
      photos: Number(photos),
      row: {
        name,
        description: `${name}. ${about}`,
        priceCents: Number(price),
        stock: Number(stock),
        categoryId,
        createdAt: new Date(FIRST_CREATED_AT + index * 60_000),
      },
    };
  });

  const inserted = await db
    .insert(products)
    .values(parsed.map(({ row }) => row))
    .returning({ id: products.id, name: products.name });

  const images = inserted.flatMap((product, index) =>
    Array.from({ length: parsed[index]!.photos }, (_, position) => ({
      productId: product.id,
      path: `/images/${fileName(product.name)}-${position + 1}.svg`,
      position,
    })),
  );
  await db.insert(productImages).values(images);
}
