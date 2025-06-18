import { Failure } from "#types/failure.ts";

export class UserFailures {
  static readonly USER_NOT_FOUND = new Failure("User not found", "USER_NOT_FOUND", 404);

  static readonly EMAIL_IN_USE = new Failure("Email is in use", "EMAIL_IN_USE", 400);
}
