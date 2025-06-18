const mark: unique symbol = Symbol();

export class Uuid {
  constructor(value: string) {
    this.value = value;
  }

  get mark() {
    return mark;
  }

  readonly value: string;
}
