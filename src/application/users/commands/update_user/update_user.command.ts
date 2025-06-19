import type { Maybe } from "#types/maybe.ts";

export class UpdateUserCommand {
  constructor(
    uuid: string,
    email: Maybe<string>,
    has_verified_email: Maybe<boolean>,
    password: Maybe<string>
  ) {
    this.uuid = uuid;
    this.email = email;
    this.has_verified_email = has_verified_email;
    this.password = password;
  }

  readonly uuid: string;
  readonly email: Maybe<string>;
  readonly has_verified_email: Maybe<boolean>
  readonly password: Maybe<string>;
}
