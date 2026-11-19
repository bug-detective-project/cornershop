import { createApp } from './app.ts';
import { databaseUrl, port } from './config.ts';
import { isInitialized, openDatabase, resetDatabase } from './db.ts';

const { db } = openDatabase(databaseUrl());
// The first start on a new database: create the tables and the sample shop.
if (!(await isInitialized(db))) {
  await resetDatabase(db);
}
const app = createApp({ db, log: (line) => console.log(line) });

app.listen(port, () => {
  console.log(`CornerShop API listening on http://localhost:${port}`);
});
