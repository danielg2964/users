const mark: unique symbol = Symbol();

export class UserEmail {
  constructor(value: string, is_verified: boolean) {
    this.value = value;
    this.is_verified = is_verified;
  }

  get mark() {
    return mark;
  }

  readonly value: string;
  readonly is_verified: boolean
}
