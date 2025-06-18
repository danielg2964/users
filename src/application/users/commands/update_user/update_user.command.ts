import type { Maybe } from "#types/maybe.ts";

export class UpdateUserCommand {
  constructor(
    uuid: string,
    email: Maybe<string>,
    password: Maybe<string>
  ) {
    this.uuid = uuid;
    this.email = email;
    this.password = password;
  }

  readonly uuid: string;
  readonly email: Maybe<string>;
  readonly password: Maybe<string>;
}
