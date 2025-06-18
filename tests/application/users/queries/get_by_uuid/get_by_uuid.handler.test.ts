import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker"
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import { GetByUuidHandler } from "#application/users/queries/get_by_uuid/get_by_uuid.handler.ts";
import { Maybe } from "#types/maybe.ts";
import { GetByUuidQuery } from "#application/users/queries/get_by_uuid/get_by_uuid.query.ts";
import { UserFailures } from "#application/users/user.failures.ts";

describe("GetByUuidHandler Test", () => {
  const user_uuid = faker.string.uuid();

  const user_to_find = new UserEntity(
    new Uuid(user_uuid),
    new UserEmail(faker.internet.email(), true),
    new UserPassword(faker.string.hexadecimal({ length: 12 }))
  );

  const query = new GetByUuidQuery(user_uuid);

  const user_repository_mock: UserRepository = {
    findByUuid(_) {}
  } as UserRepository;

  let handler: GetByUuidHandler;

  beforeEach(() => {
    handler = new GetByUuidHandler(user_repository_mock);
  });

  it("should return USER_NOT_FOUND Failure", async () => {
    const findByUuidMock = mock.method(user_repository_mock, "findByUuid");
    findByUuidMock.mock.mockImplementationOnce(async uuid => {
      assert.equal(uuid, query.uuid);

      return Maybe.nothing();
    });

    const result = await handler.handle(query);
    assert.equal(result.is_right, true);

    const failure = result.right;
    assert.equal(failure, UserFailures.USER_NOT_FOUND);

    assert.equal(findByUuidMock.mock.callCount(), 1);
  });

  it("should return the user successfully", async () => {
    const findByUuidMock = mock.method(user_repository_mock, "findByUuid");
    findByUuidMock.mock.mockImplementationOnce(async uuid => {
      assert.equal(uuid, query.uuid);

      return Maybe.some(user_to_find);
    });

    const result = await handler.handle(query);
    assert.equal(result.is_left, true);

    const user = result.left;
    assert.deepEqual(user, user_to_find);

    assert.equal(findByUuidMock.mock.callCount(), 1);
  });
});

