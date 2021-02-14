import { Column, Entity } from "typeorm";

import Model from "./Model";

@Entity("users")
export default class User extends Model {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  hash: string;
}
