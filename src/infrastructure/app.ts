import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { UsersRoutes } from "./users/users.routes.ts";
import { MongoUserRepository } from "./users/mongo-user.repository.ts";
import { getMongoCollection } from "./db/mongo.db.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import { Argon2Hasher } from "./shared/argon2-hasher.ts";
import { UuidUuidGenerator } from "./shared/uuid-uuid.generator.ts";

export type AppInstance = Awaited<ReturnType<typeof createApp>>

export async function createApp() {
  const app = fastify();

  const hasher = new Argon2Hasher();
  const uuid_generator = new UuidUuidGenerator();

  const users_collection = await getMongoCollection<UserEntity>("users");
  const user_repository = new MongoUserRepository(users_collection);
  const users_routes = new UsersRoutes(
    user_repository,
    hasher,
    uuid_generator
  );

  await app.register(users_routes.registerRoutes, { prefix: "users" });

  return app.withTypeProvider<TypeBoxTypeProvider>();
}

