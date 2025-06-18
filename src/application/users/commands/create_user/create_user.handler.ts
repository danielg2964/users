import type { Hasher } from "#application/shared/hasher.ts";
import type { UuidGenerator } from "#application/shared/uuid.generator.ts";
import { UserFailures } from "#application/users/user.failures.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { Either } from "#types/either.ts";
import { Failure } from "#types/failure.ts";
import type { CreateUserCommand } from "./create_user.command.ts";

export class CreateUserHandler {
  constructor(
    user_repository: UserRepository,
    hasher: Hasher,
    uuid_generator: UuidGenerator,
  ) {
    this.#user_repository = user_repository;
    this.#hasher = hasher;
    this.#uuid_generator = uuid_generator;
  }
  
  readonly #user_repository: UserRepository;
  readonly #hasher: Hasher;
  readonly #uuid_generator: UuidGenerator;

  async handle(command: CreateUserCommand): Promise<Either<UserEntity, Failure>> {
    const user_finded_result = await this.#user_repository.findByEmail(command.email);

    if (user_finded_result.has_value) {
      return Either.right(UserFailures.EMAIL_IN_USE);
    }

    const hash = await this.#hasher.hash(command.password);
    const uuid = this.#uuid_generator.generateUuid();

    const user_to_save = new UserEntity(
      new Uuid(uuid),
      new UserEmail(command.email, false),
      new UserPassword(hash)
    );

    const user_saved = await this.#user_repository.save(user_to_save);

    return Either.left(user_saved);
  }
}
