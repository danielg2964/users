import { Entity } from "#domain/shared/entity.ts"
import type { Uuid } from "#domain/shared/uuid.ts";
import type { UserEmail } from "../user.email.ts";
import type { UserPassword } from "../user.password.ts";

export class UserEntity extends Entity {
  constructor(uuid: Uuid, email: UserEmail, password: UserPassword) {
    super(uuid);

    this.email = email;
    this.password = password;
  }

  readonly email: UserEmail;
  readonly password: UserPassword;
}
