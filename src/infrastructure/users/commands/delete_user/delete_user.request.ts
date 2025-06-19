import { Type, type Static } from "@sinclair/typebox";

export const DeleteUserRequest = Type.Object({
  uuid: Type.String({ format: "uuid" })
});

export type DeleteUserRequest = Static<typeof DeleteUserRequest>
