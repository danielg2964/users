import { Type, type Static } from "@sinclair/typebox";

export const UpdateUserRequest = Type.Object({
  uuid: Type.String({ format: "uuid" }),
  email: Type.Union([Type.String({ format: "email" }), Type.Null()], { default: null }),
  has_verified_email: Type.Union([Type.Boolean(), Type.Null()], { default: null }),
  password: Type.Union([Type.String(), Type.Null()], { default: null })
});

export type UpdateUserRequest = Static<typeof UpdateUserRequest>
