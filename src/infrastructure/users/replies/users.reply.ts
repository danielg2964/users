import { Reply } from "#infrastructure/shared/reply.ts";
import type { UserDto } from "../dtos/user.dto.ts";

export class UsersReply extends Reply {
  constructor(users: UserDto[], message: string, code: string, status_code: number) {
    super(message, code, status_code);

    this.users = users;
  }

  readonly users: UserDto[];
}
