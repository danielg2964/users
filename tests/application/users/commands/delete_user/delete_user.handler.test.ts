import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import { DeleteUserHandler } from "#application/users/commands/delete_user/delete_user.handler.ts";
import { Maybe } from "#types/maybe.ts";
import { DeleteUserCommand } from "#application/users/commands/delete_user/delete_user.command.ts";
import { UserFailures } from "#application/users/user.failures.ts";

describe("DeleteUserHandler Test", () => {
  const user_uuid = faker.string.uuid();

  const user_to_delete = new UserEntity(
    new Uuid(user_uuid),
    new UserEmail(faker.internet.email(), true),
    new UserPassword(faker.string.alphanumeric({ length: 12 }))
  );

  const command = new DeleteUserCommand(user_uuid);

  const user_repository_mock: UserRepository = {
    async deleteByUuid(uuid) {
      assert.equal(uuid, user_uuid);

      return Maybe.some(user_to_delete);
    }
  } as UserRepository;

  let handler: DeleteUserHandler;

  beforeEach(() => {
    handler = new DeleteUserHandler(user_repository_mock);
  });

  it("should return USER_NOT_FOUND Failure", async () => {
    const deleteByUuidMock = mock.method(user_repository_mock, "deleteByUuid");
    deleteByUuidMock.mock.mockImplementationOnce(async uuid => {
      assert.equal(uuid, user_uuid);

      return Maybe.nothing();
    });

    const result = await handler.handle(command);
    assert.equal(result.is_right, true);

    const failure = result.right;
    assert.equal(failure, UserFailures.USER_NOT_FOUND);
  });

  it("should delete user successfully and return the user deleted", async () => {
    const deleteByUuidMock = mock.method(user_repository_mock, "deleteByUuid");
    deleteByUuidMock.mock.mockImplementationOnce(async uuid => {
      assert.equal(uuid, user_uuid);

      return Maybe.some(user_to_delete)
    });

    const result = await handler.handle(command);
    assert.equal(result.is_left, true);

    const user_deleted = result.left;
    assert.deepEqual(user_deleted, user_to_delete);
  });
});

