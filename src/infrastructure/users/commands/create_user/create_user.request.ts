import { Type, type Static } from "@sinclair/typebox";

export const CreateUserRequest = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String()
});

export type CreateUserRequest = Static<typeof CreateUserRequest>

