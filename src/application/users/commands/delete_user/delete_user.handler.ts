import { UserFailures } from "#application/users/user.failures.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import { Either } from "#types/either.ts";
import { Failure } from "#types/failure.ts";
import type { DeleteUserCommand } from "./delete_user.command.ts";

export class DeleteUserHandler {
  constructor(user_repository: UserRepository) {
    this.#user_repository = user_repository;
  }

  readonly #user_repository: UserRepository;

  async handle(command: DeleteUserCommand): Promise<Either<UserEntity, Failure>> {
    const user_deleted_result = await this.#user_repository.deleteByUuid(command.uuid);

    if (!user_deleted_result.has_value) {
      return Either.right(UserFailures.USER_NOT_FOUND);
    }

    const user_deleted = user_deleted_result.value;

    return Either.left(user_deleted);
  }
}
