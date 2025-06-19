import type { Hasher } from "#application/shared/hasher.ts";
import { UserFailures } from "#application/users/user.failures.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { Either } from "#types/either.ts";
import { Failure } from "#types/failure.ts";
import type { UpdateUserCommand } from "./update_user.command.ts";

export class UpdateUserHandler {
  constructor(
    user_repository: UserRepository,
    hasher: Hasher,
  ) {
    this.#user_repository = user_repository;
    this.#hasher = hasher;
  }

  readonly #user_repository: UserRepository;
  readonly #hasher: Hasher;

  async handle(command: UpdateUserCommand): Promise<Either<UserEntity, Failure>> {
    const user_finded_result = await this.#user_repository.findByUuid(command.uuid);

    if (!user_finded_result.has_value) {
      return Either.right(UserFailures.USER_NOT_FOUND);
    }

    const user_finded = user_finded_result.value;

    let user_email = user_finded.email;
    if (command.email.has_value) {
      const email_in_use_result = await this.#user_repository.findByEmail(command.email.value);

      if (email_in_use_result.has_value) {
        return Either.right(UserFailures.EMAIL_IN_USE);
      }

      user_email = new UserEmail(command.email.value, false);
    }

    let user_password = user_finded.password;
    if (command.password.has_value) {
      const hash = await this.#hasher.hash(command.password.value);

      user_password = new UserPassword(hash);
    }

    const new_user = new UserEntity(user_finded.uuid, user_email, user_password);

    const user_saved = await this.#user_repository.save(new_user);

    return Either.left(user_saved);
  }
}
