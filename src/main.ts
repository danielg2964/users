import type { Entity } from "#domain/shared/entity.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";

function tests(entity: Entity) {

  console.log(entity);
}

export async function main() {
  tests(new UserEntity(
    new Uuid("asdfasdfasd"),
    new UserEmail("asdfasdf", true),
    new UserPassword("asdfasfdsa"))
  );
}

await main();
