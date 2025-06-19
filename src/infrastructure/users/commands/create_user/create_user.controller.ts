import { FailureReply } from "#infrastructure/shared/replies/failure.reply.ts"
import type { CreateUserHandler } from "#application/users/commands/create_user/create_user.handler.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateUserRequest } from "./create_user.request.ts";
import { CreateUserCommand } from "#application/users/commands/create_user/create_user.command.ts";
import { UserDto } from "#infrastructure/users/dtos/user.dto.ts";
import { UserReply } from "#infrastructure/users/replies/user.reply.ts";

export class CreateUserController {
  constructor(handler: CreateUserHandler) {
    this.#handler = handler;
  }

  readonly #handler: CreateUserHandler;

  readonly handle = async (req: FastifyRequest<{Body:CreateUserRequest}>, rep: FastifyReply) => {
    const request = req.body;

    const command = new CreateUserCommand(request.email, request.password);

    const result = await this.#handler.handle(command);

    if (result.is_right) {
      const failure = result.right;

      const reply = new FailureReply(failure);

      rep.code(reply.status_code).send(reply);
    } else {
      const user_created = result.left;

      const user_dto = new UserDto(
        user_created.uuid.value,
        user_created.email.value,
        user_created.email.is_verified
      );

      const reply = new UserReply(user_dto, "Ok", "OK", 200);

      rep.code(reply.status_code).send(reply);
    }
  }
}
