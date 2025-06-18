export class DeleteUserCommand {
  constructor(uuid: string) {
    this.uuid = uuid;
  }

  readonly uuid: string;
}
