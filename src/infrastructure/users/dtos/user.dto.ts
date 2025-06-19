export class UserDto {
  constructor(uuid: string, email: string, has_verified_email: boolean) {
    this.uuid = uuid;
    this.email = email;
    this.has_verified_email = has_verified_email;
  }

  readonly uuid: string;
  readonly email: string;
  readonly has_verified_email: boolean;
}
