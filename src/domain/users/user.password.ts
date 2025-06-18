const mark: unique symbol = Symbol();

export class UserPassword {
  constructor(value: string) {
    this.value = value;
  }

  get mark() {
    return mark;
  }

  readonly value: string;
}
