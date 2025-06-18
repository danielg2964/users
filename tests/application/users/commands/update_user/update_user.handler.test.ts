import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import type { Hasher } from "#application/shared/hasher.ts";
import { Maybe } from "#types/maybe.ts";
import { UserFailures } from "#application/users/user.failures.ts";
import { UpdateUserCommand } from "#application/users/commands/update_user/update_user.command.ts";
import { UpdateUserHandler } from "#application/users/commands/update_user/update_user.handler.ts";

describe("UpdatUserHandler Test", () => {
  const user_uuid = faker.string.uuid();

  const user = new UserEntity(
    new Uuid(user_uuid),
    new UserEmail(faker.internet.email(), false),
    new UserPassword(faker.string.alphanumeric({ length: 12 }))
  );

  const new_user_email = faker.internet.email();
  const new_user_password = faker.internet.password();
  const command = new UpdateUserCommand(
    user_uuid,
    Maybe.some(new_user_email),
    Maybe.some(new_user_password)
  );

  const user_repository_mock: UserRepository = {
    async findByUuid(uuid) {
      assert.equal(uuid, user_uuid);

      return Maybe.some(user);
    },
    async findByEmail(email) {
      assert.equal(email, command.email.value);

      return Maybe.nothing();
    },
    save(_) {}
  } as UserRepository;

  const hasher_mock: Hasher = {
    hash(_) {}
  } as Hasher;

  let handler: UpdateUserHandler;

  beforeEach(() => {
    handler = new UpdateUserHandler(
      user_repository_mock,
      hasher_mock,
    );
  })

  it("should return USER_NOT_FOUND Failure", async () => {
    const findByUuidMock = mock.method(user_repository_mock, "findByUuid");
    findByUuidMock.mock.mockImplementationOnce(async uuid => {
      assert.equal(uuid, command.uuid);

      return Maybe.nothing();
    });

    const result = await handler.handle(command);
    assert.equal(result.is_right, true);

    const failure = result.right;
    assert.equal(failure, UserFailures.USER_NOT_FOUND);

    assert.equal(findByUuidMock.mock.callCount(), 1);
  })

  it("should return EMAIL_IN_USE Failure", async () => {
    const user_finded = new UserEntity(
      new Uuid(faker.string.uuid()),
      new UserEmail(faker.internet.email(), true),
      new UserPassword(faker.string.hexadecimal({ length:12 }))
    );

    const findByEmailMock = mock.method(user_repository_mock, "findByEmail");

    findByEmailMock.mock.mockImplementationOnce(async email => {
      assert.equal(email, command.email.value);

      return Maybe.some(user_finded);
    });

    const result = await handler.handle(command);
    assert.equal(result.is_right, true);

    const failure = result.right;
    assert.equal(failure, UserFailures.EMAIL_IN_USE);

    assert.equal(findByEmailMock.mock.callCount(), 1);
  });

  it("should update the user successfully", async () => {
    const hash_faked = faker.string.hexadecimal({ length: 12 });

    const hashMock = mock.method(hasher_mock, "hash");
    hashMock.mock.mockImplementationOnce(async plain => {
      assert.equal(plain, command.password.value);

      return hash_faked;
    })
      
    let user_saved: UserEntity = null!;
    const saveMock = mock.method(user_repository_mock, "save");
    saveMock.mock.mockImplementationOnce(async user => {
      assert.equal(user.uuid.value, user_uuid);
      assert.equal(user.email.value, command.email.value);
      assert.equal(user.email.is_verified, false);
      assert.equal(user.password.value, hash_faked);

      user_saved = user;

      return user;
    });
    
    const result = await handler.handle(command);
    assert.equal(result.is_left, true);

    const user_result = result.left;
    assert.deepEqual(user_result, user_saved);

    assert.equal(hashMock.mock.callCount(), 1);
    assert.equal(saveMock.mock.callCount(), 1);
  });
});

