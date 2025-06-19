import { Type, type Static } from "@sinclair/typebox";

export const CreateUserRequest = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 })
});

export type CreateUserRequest = Static<typeof CreateUserRequest>

