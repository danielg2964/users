import { Uuid } from "./uuid.ts";

export class Entity {
  constructor(uuid: Uuid) {
    this.uuid = uuid;
  }

  readonly uuid: Uuid;

  equals(other: Entity): boolean {
    return other.uuid.value === this.uuid.value;
  }
}
