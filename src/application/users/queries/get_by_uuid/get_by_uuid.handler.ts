import { UserFailures } from "#application/users/user.failures.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import { Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import type { GetByUuidQuery } from "./get_by_uuid.query.ts";

export class GetByUuidHandler {
  constructor(user_repository: UserRepository) {
    this.#user_repository = user_repository;
  }

  readonly #user_repository: UserRepository;

  async handle(query: GetByUuidQuery): Promise<Either<UserEntity, Failure>> {
    const user_result = await this.#user_repository.findByUuid(query.uuid);

    if (!user_result.has_value) {
      return Either.right(UserFailures.USER_NOT_FOUND);
    }

    const user = user_result.value;

    return Either.left(user);
  }
}
