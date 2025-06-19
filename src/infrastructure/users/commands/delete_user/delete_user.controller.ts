import type { DeleteUserHandler } from "#application/users/commands/delete_user/delete_user.handler.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { DeleteUserRequest } from "./delete_user.request.ts";
import { DeleteUserCommand } from "#application/users/commands/delete_user/delete_user.command.ts";
import { FailureReply } from "#infrastructure/shared/replies/failure.reply.ts";
import { UserDto } from "#infrastructure/users/dtos/user.dto.ts";
import { UserReply } from "#infrastructure/users/replies/user.reply.ts";

export class DeleteUserController {
  constructor(handler: DeleteUserHandler) {
    this.#handler = handler;
  }

  readonly #handler: DeleteUserHandler;

  readonly handle = async (req: FastifyRequest<{Querystring:DeleteUserRequest}>, rep: FastifyReply) => {
    const command = new DeleteUserCommand(req.query.uuid);

    const result = await this.#handler.handle(command);

    if (result.is_right) {
      const failure = result.right;

      const reply = new FailureReply(failure);

      rep.code(reply.status_code).send(reply);
    } else {
      const user = result.left;

      const user_dto = new UserDto(user.uuid.value, user.email.value, user.email.is_verified);

      const reply = new UserReply(user_dto, "Ok", "OK", 200);

      rep.code(reply.status_code).send(reply);
    }
  }

}
