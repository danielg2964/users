import type { GetByUuidHandler } from "#application/users/queries/get_by_uuid/get_by_uuid.handler.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetByUuidRequest } from "./get_by_uuid.request.ts";
import { GetByUuidQuery } from "#application/users/queries/get_by_uuid/get_by_uuid.query.ts";
import { FailureReply } from "#infrastructure/shared/replies/failure.reply.ts";
import { UserDto } from "#infrastructure/users/dtos/user.dto.ts";
import { UserReply } from "#infrastructure/users/replies/user.reply.ts";

export class GetByUuidController {
  constructor(handler: GetByUuidHandler) {
    this.#handler = handler;
  }

  readonly #handler: GetByUuidHandler;

  readonly handle = async (req: FastifyRequest<{Querystring:GetByUuidRequest}>, rep: FastifyReply) => {
    const request = req.query;

    const query = new GetByUuidQuery(request.uuid);

    const result = await this.#handler.handle(query);

    if (result.is_right) {
      const failure = result.right;

      const reply = new FailureReply(failure);

      rep.code(reply.status_code).send(reply);
    } else {
      const user = result.left;

      const user_dto = new UserDto(
        user.uuid.value,
        user.email.value,
        user.email.is_verified
      );

      const reply = new UserReply(user_dto, "Ok", "OK", 200);

      rep.code(reply.status_code).send(reply);
    }
  }
}
