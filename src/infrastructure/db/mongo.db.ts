import { MongoClient } from "mongodb";
import type { Entity } from "#domain/shared/entity.ts";

const host = process.env["MONGO_HOST"] ?? "localhost";

const port = Number(process.env["MONGO_PORT"] ?? 27017);

const db_name = process.env["MONGO_DB"] ?? "users"

const client = new MongoClient(`mongodb://${host}:${port}`);

export async function connectToMongo() {
  await client.connect();
  console.log("Connected to mongo!");
}

export async function getMongoCollection<T extends Entity>(collection_name: string) {
  const db = client.db(db_name);
  const collection = db.collection<T>(collection_name);

  return collection; 
}
