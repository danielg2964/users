import { Entity } from "#domain/shared/entity.ts";
import type { Uuid } from "#domain/shared/uuid.ts";
import type { Maybe } from "#types/maybe.ts";

export interface Repository<T extends Entity> {
  save(entity: T): Promise<T>;

  findMany(): Promise<T[]>;

  findByUuid(uuid: Uuid): Promise<Maybe<T>>

  deleteByUuid(uuid: Uuid): Promise<Maybe<T>>
}
