import type { Hasher } from "#application/shared/hasher.ts";
import type { UuidGenerator } from "#application/shared/uuid.generator.ts";
import { CreateUserHandler } from "#application/users/commands/create_user/create_user.handler.ts";
import { DeleteUserHandler } from "#application/users/commands/delete_user/delete_user.handler.ts";
import { UpdateUserHandler } from "#application/users/commands/update_user/update_user.handler.ts";
import { GetAllHandler } from "#application/users/queries/get_all/get_all.handler.ts";
import { GetByUuidHandler } from "#application/users/queries/get_by_uuid/get_by_uuid.handler.ts";
import type { UserRepository } from "#application/users/user.repository.ts";
import type { AppInstance } from "#infrastructure/app.ts";
import { CreateUserController } from "./commands/create_user/create_user.controller.ts";
import { CreateUserRequest } from "./commands/create_user/create_user.request.ts";
import { DeleteUserController } from "./commands/delete_user/delete_user.controller.ts";
import { DeleteUserRequest } from "./commands/delete_user/delete_user.request.ts";
import { UpdateUserController } from "./commands/update_user/update_user.controller.ts";
import { UpdateUserRequest } from "./commands/update_user/update_user.request.ts";
import { GetAllController } from "./queries/get_all/get_all.controller.ts";
import { GetByUuidController } from "./queries/get_by_uuid/get_by_uuid.controller.ts";
import { GetByUuidRequest } from "./queries/get_by_uuid/get_by_uuid.request.ts";

export class UsersRoutes {
  constructor(
    user_repository: UserRepository,
    hasher: Hasher,
    uuid_generator: UuidGenerator
  ) {
    this.#user_repository = user_repository;
    this.#hasher = hasher;
    this.#uuid_generator = uuid_generator;
  }

  readonly #user_repository: UserRepository;
  readonly #hasher: Hasher;
  readonly #uuid_generator: UuidGenerator;

  readonly registerRoutes = async (app: AppInstance) => {
    // create-user 
    const create_user_handler = new CreateUserHandler(
      this.#user_repository,
      this.#hasher,
      this.#uuid_generator
    );

    const create_user_controller = new CreateUserController(create_user_handler);

    app.route({
      method: "POST",
      url: "/create-user",
      schema: {
        body: CreateUserRequest
      },
      handler: create_user_controller.handle
    });

    // delete-user
    const delete_user_handler = new DeleteUserHandler(this.#user_repository);

    const delete_user_controller = new DeleteUserController(delete_user_handler);

    app.route({
      method: "DELETE",
      url: "/delete-user",
      schema: {
        querystring: DeleteUserRequest
      },
      handler: delete_user_controller.handle
    })

    // update-user
    const update_user_handler = new UpdateUserHandler(this.#user_repository, this.#hasher);

    const update_user_controller = new UpdateUserController(update_user_handler);

    app.route({
      method: "PUT",
      url: "/update-user",
      schema: {
        body:  UpdateUserRequest
      },
      handler: update_user_controller.handle
    });

    // get-all
    const get_all_handler = new GetAllHandler(this.#user_repository);

    const get_all_controller = new GetAllController(get_all_handler);

    app.route({
      method: "GET",
      url: "/get-all",
      handler: get_all_controller.handle
    });

    // get-by-uuid
    const get_by_uuid_handler = new GetByUuidHandler(this.#user_repository);

    const get_by_uuid_controller = new GetByUuidController(get_by_uuid_handler);

    app.route({
      method: "GET",
      url: "/get-by-uuid",
      schema: {
        querystring: GetByUuidRequest
      },
      handler: get_by_uuid_controller.handle
    });

  }
}
