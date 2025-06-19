import type { UserRepository } from "#application/users/user.repository.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";

export class GetAllHandler {
  constructor(user_repository: UserRepository) {
    this.#user_repository = user_repository;
  }

  readonly #user_repository: UserRepository;

  async handle(): Promise<UserEntity[]> {
    return await this.#user_repository.findMany();
  }
}
