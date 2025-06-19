import { Type, type Static } from "@sinclair/typebox";

export const GetByUuidRequest = Type.Object({
  uuid: Type.String({ format: "uuid" })
});

export type GetByUuidRequest = Static<typeof GetByUuidRequest>
