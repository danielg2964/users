import type { Repository } from "#application/shared/repository.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import type { Maybe } from "#types/maybe.ts";

export interface UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<Maybe<UserEntity>>
}
