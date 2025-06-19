import type { GetAllHandler } from "#application/users/queries/get_all/get_all.handler.ts";
import { UserDto } from "#infrastructure/users/dtos/user.dto.ts";
import { UsersReply } from "#infrastructure/users/replies/users.reply.ts";
import type { FastifyRequest, FastifyReply } from "fastify";

export class GetAllController {
  constructor(handler: GetAllHandler) {
    this.#handler = handler
  }

  readonly #handler: GetAllHandler;

  readonly handle = async (_req: FastifyRequest, rep: FastifyReply) => {
    const result = await this.#handler.handle();

    const users_dto: UserDto[] = result.map(u => new UserDto(
      u.uuid.value,
      u.email.value,
      u.email.is_verified
    ));

    const reply = new UsersReply(users_dto, "Ok", "OK", 200);

    rep.code(reply.status_code).send(reply);
  }
}
