import { createApp } from "#infrastructure/app.ts";
import { connectToMongo } from "#infrastructure/db/mongo.db.ts";

export async function main() {
  await connectToMongo();

  const app = await createApp();

  const port = Number(process.env["PORT"] || 3000);

  const connection = await app.listen({ port });

  const routes = app.printRoutes();

  console.log(routes);
  console.log(connection);
}

await main();
