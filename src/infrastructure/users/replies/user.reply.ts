import { Reply } from "#infrastructure/shared/reply.ts";
import type { UserDto } from "../dtos/user.dto.ts";

export class UserReply extends Reply {
  constructor(user: UserDto, message: string, code: string, status_code: number) {
    super(message, code, status_code);

    this.user = user;
  }

  readonly user: UserDto;
}
