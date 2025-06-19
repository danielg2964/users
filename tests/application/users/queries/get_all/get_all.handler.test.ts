import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import { GetAllHandler } from "#application/users/queries/get_all/get_all.handler.ts";

describe("GetAll Test", () => {
  let email_validated = false;

  const users: UserEntity[] = Array.from({ length: 30 }, _ => {
    email_validated = !email_validated;

    return new UserEntity(
      new Uuid(faker.string.uuid()),
      new UserEmail(faker.internet.email(), email_validated),
      new UserPassword(faker.string.hexadecimal({ length: 12 })))
    }
  );

  const user_repository_mock: UserRepository = {
    findMany() {}
  } as UserRepository;

  let handler: GetAllHandler;

  beforeEach(() => {
    handler = new GetAllHandler(user_repository_mock);
  });

  it("should return all users", async () => {
    const findManyMock = mock.method(user_repository_mock, "findMany");
    findManyMock.mock.mockImplementationOnce(async () => {
      return users;
    });

    const result = await handler.handle();
    assert.deepEqual(result, users);

    assert.equal(findManyMock.mock.callCount(), 1);
  });
});

