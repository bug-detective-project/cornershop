# CornerShop

The storefront of a neighborhood shop: shelves by category, a search, a page per product and a
small panel where the owner adds products and keeps the stock. It is a game project of
[Bug Detective](https://github.com/bug-detective-project): this branch (`main`) is the app with
every bug fixed; the tickets players get are built from it (see the `qa` branch).

| Part      | Stack                                                   |
| --------- | ------------------------------------------------------- |
| `client/` | React, Vite, React Router, TanStack Query, Tailwind CSS |
| `server/` | Node.js, Express, Drizzle ORM                           |
| Database  | PostgreSQL 17                                           |

## Running it

The app needs a PostgreSQL database and reads its address from `DATABASE_URL`; nothing in the code
knows a fixed address. Inside Bug Detective the database is already there: the app starts it next
to your workspace and sets the variable.

```sh
npm ci
npm run db:reset   # create the tables and the sample shop
npm run dev        # the shop on http://localhost:5173, the API on http://localhost:3001
```

Outside Bug Detective, start a PostgreSQL 17 yourself and set `DATABASE_URL`, for example
`postgres://postgres:cornershop@localhost:5432/cornershop` (`services.json` has the settings the
game uses).

| Command                                   | What it does                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`                             | Starts the API and the client, both reloading on change                                                 |
| `npm run db:reset`                        | Empties the database and puts the sample shop back                                                      |
| `npm run db:generate`                     | After a change to `server/src/schema.ts`, writes the next migration to `server/drizzle/`                |
| `npm test`                                | Runs every test (the server's tests use a database of their own, `cornershop_test`, on the same server) |
| `npm run lint` / `npm run lint:fix`       | ESLint, which also formats the TypeScript files                                                         |
| `npm run format` / `npm run format:check` | Prettier, for every other file                                                                          |

## Looking at the data

```sh
psql "$DATABASE_URL"
```

In VS Code, the SQLTools extension (recommended by this project) connects to the same address.

## How it is organized

- **Money is whole cents** in the database and in the API (`priceCents`: 450 is $4.50). Only the
  screen turns it into text (`client/src/utils/formatPrice.ts`).
- **A price field with a mask** is `client/src/components/PriceInput.tsx`: the digits come in from
  the right as cents (4, 5, 0 shows $4.50), and the page keeps the price as plain text ("4.50").
- **The filters of the storefront live in the URL** (`client/src/filters.ts`), so a reload, a
  shared link and the Back button show the same list.
- **The client keeps a cache of what the API answered** (TanStack Query, `client/src/api/`). After a
  change, the mutation says which cached lists are out of date.
- **Colors are theme tokens** (`client/src/styles.css`): components use `bg-surface`,
  `text-content` and the like, never a fixed color.
- **Phones down to 375px wide** are supported; below 768px some parts of the screens change (the
  owner panel shows the row actions on hover, the footer keeps only the address).
- **The product photos** are real photos under free licenses, in `client/public/images/`; their
  authors and licenses are in `client/public/images/CREDITS.md`.
- **The API** (`server/src/routes/`) answers only `localhost` and `127.0.0.1`, validates what it
  receives (`server/src/validation.ts`) and logs one JSON line per request with a request id
  (`server/src/log.ts`).
- **The schema** is `server/src/schema.ts`; the SQL in `server/drizzle/` is generated from it.

## License

[PolyForm Noncommercial 1.0.0](LICENSE).
