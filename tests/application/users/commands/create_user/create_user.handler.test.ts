import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { CreateUserCommand } from "#application/users/commands/create_user/create_user.command.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import type { Hasher } from "#application/shared/hasher.ts";
import type { UuidGenerator } from "#application/shared/uuid.generator.ts";
import { CreateUserHandler } from "#application/users/commands/create_user/create_user.handler.ts";
import { Maybe } from "#types/maybe.ts";
import { UserFailures } from "#application/users/user.failures.ts";

describe("CreatUserHandler Test", () => {
  const command = new CreateUserCommand(
    faker.internet.email(),
    faker.string.alphanumeric({ length: 12 })
  );

  const user_repository_mock: UserRepository = {
    async findByEmail(email) {
      assert.equal(email, command.email);

      return Maybe.nothing();
    },
    save(_) {}
  } as UserRepository;

  const hasher_mock: Hasher = {
    hash(_) {}
  } as Hasher;

  const uuid_generator_mock: UuidGenerator = {
    generateUuid() {}
  } as UuidGenerator;

  let handler: CreateUserHandler;

  beforeEach(() => {
    handler = new CreateUserHandler(
      user_repository_mock,
      hasher_mock,
      uuid_generator_mock
    );
  })

  it("should return EMAIL_IN_USE Failure", async () => {
    const user_finded = new UserEntity(
      new Uuid(faker.string.uuid()),
      new UserEmail(faker.internet.email(), true),
      new UserPassword(faker.string.hexadecimal({ length:12 }))
    );

    const findByEmailMock = mock.method(user_repository_mock, "findByEmail");

    findByEmailMock.mock.mockImplementationOnce(async email => {
      assert.equal(email, command.email);

      return Maybe.some(user_finded);
    });

    const result = await handler.handle(command);
    assert.equal(result.is_right, true);

    const failure = result.right;
    assert.equal(failure, UserFailures.EMAIL_IN_USE);

    assert.equal(findByEmailMock.mock.callCount(), 1);
  });

  it("should create the user successfully", async () => {
    const hash_faked = faker.string.hexadecimal({ length: 12 });

    const hashMock = mock.method(hasher_mock, "hash");
    hashMock.mock.mockImplementationOnce(async plain => {
      assert.equal(plain, command.password);

      return hash_faked;
    })

    const uuid_faked = faker.string.uuid();
    const generateUuidMock = mock.method(uuid_generator_mock, "generateUuid");
    generateUuidMock.mock.mockImplementationOnce(() => {
      return uuid_faked;
    });
      
    let user_saved: UserEntity = null!;
    const saveMock = mock.method(user_repository_mock, "save");
    saveMock.mock.mockImplementationOnce(async user => {
      assert.equal(user.uuid.value, uuid_faked);
      assert.equal(user.email.value, command.email);
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
    assert.equal(generateUuidMock.mock.callCount(), 1);
    assert.equal(saveMock.mock.callCount(), 1);
  });
});

