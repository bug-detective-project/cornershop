import { defineConfig } from 'drizzle-kit';

// `npm run db:generate` compares src/schema.ts with the migrations and writes the next SQL file.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
});
