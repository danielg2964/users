import type { UpdateUserHandler } from "#application/users/commands/update_user/update_user.handler.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { UpdateUserRequest } from "./update_user.request.ts";
import { UpdateUserCommand } from "#application/users/commands/update_user/update_user.command.ts";
import { Maybe } from "#types/maybe.ts";
import { FailureReply } from "#infrastructure/shared/replies/failure.reply.ts";
import { UserDto } from "#infrastructure/users/dtos/user.dto.ts";
import { UserReply } from "#infrastructure/users/replies/user.reply.ts";

export class UpdateUserController {
  constructor(handler: UpdateUserHandler) {
    this.#handler = handler;
  }

  readonly #handler: UpdateUserHandler;

  readonly handle = async (req: FastifyRequest<{Body:UpdateUserRequest}>, rep: FastifyReply) => {
    const body = req.body;

    const command = new UpdateUserCommand(
      body.uuid,
      body.email === null
      ? Maybe.nothing()
      : Maybe.some(body.email),
      body.has_verified_email === null
      ? Maybe.nothing()
      : Maybe.some(body.has_verified_email),
      body.password === null
      ? Maybe.nothing()
      : Maybe.some(body.password)
    );

    const result = await this.#handler.handle(command);

    if (result.is_right) {
      const failure = result.right;

      const reply = new FailureReply(failure);

      rep.code(reply.status_code).send(reply);
    } else {
      const user = result.left;

      const user_dto = new UserDto(
        user.uuid.value,
        user.email.value,
        user.email.is_verified,
      );

      const reply = new UserReply(user_dto, "Ok", "OK", 200);

      rep.code(reply.status_code).send(reply);
    }
  }
}
