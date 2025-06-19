import { MongoClient } from "mongodb";
import type { Entity } from "#domain/shared/entity.ts";

const client = new MongoClient(process.env["MONGO_URI"]!);

const db_name = "users";

export async function connectToMongo() {
  await client.connect();
  console.log("Connected to mongo!");
}

export async function getMongoCollection<T extends Entity>(collection_name: string) {
  const db = client.db(db_name);
  const collection = db.collection<T>(collection_name);

  return collection; 
}
