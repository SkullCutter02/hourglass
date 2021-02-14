import { Column, Entity, Unique } from "typeorm";

import Model from "./Model";

@Entity("users")
@Unique(["username", "email"])
export default class User extends Model {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  toJSON(): any {
    return { ...this, id: undefined, hash: undefined };
  }
}
