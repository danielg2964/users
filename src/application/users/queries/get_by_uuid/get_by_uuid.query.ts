export class GetByUuidQuery {
  constructor(uuid: string) {
    this.uuid = uuid;
  }

  readonly uuid: string;
}
