import type { UserRepository } from "#application/users/user.repository.ts";
import { Uuid } from "#domain/shared/uuid.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { Maybe } from "#types/maybe.ts";
import type { Collection, WithId } from "mongodb";

export class MongoUserRepository implements UserRepository {
  constructor(collection: Collection<UserEntity>) {
    this.#collection = collection;
  }

  readonly #collection: Collection<UserEntity>

  #mapWithId(with_id: WithId<UserEntity>): UserEntity {
    return new UserEntity(
      new Uuid(with_id.uuid.value),
      new UserEmail(with_id.email.value, with_id.email.is_verified),
      new UserPassword(with_id.password.value)
    );
  }

  async findByEmail(email: string): Promise<Maybe<UserEntity>> {
    const finded = await this.#collection.findOne({ "email.value": { $eq: email } });

    if (finded === null) {
      return Maybe.nothing();
    }

    return Maybe.some(this.#mapWithId(finded));
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    const result = await this.#collection.findOneAndReplace({ "uuid.value": { $eq: entity.uuid.value } }, entity, { upsert: true });

    if (result === null) {
      return entity;
    } else {
      return this.#mapWithId(result);
    }
  }

  async findMany(): Promise<UserEntity[]> {
    const cursor = this.#collection.find();

    const users: UserEntity[] = [];

    for await (const with_id of cursor) {
      users.push(this.#mapWithId(with_id));
    }

    return users;
  }

  async findByUuid(uuid: string): Promise<Maybe<UserEntity>> {
    const finded = await this.#collection.findOne({ "uuid.value": { $eq: uuid } });

    if (finded === null) {
      return Maybe.nothing();
    }
    
    return Maybe.some(this.#mapWithId(finded));
  }

  async deleteByUuid(uuid: string): Promise<Maybe<UserEntity>> {
    const finded = await this.#collection.findOneAndDelete({ "uuid.value": { $eq: uuid }});

    if (finded === null) {
      return Maybe.nothing();
    }
    
    return Maybe.some(this.#mapWithId(finded));
  }
}
