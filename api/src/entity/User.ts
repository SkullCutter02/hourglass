import { Column, Entity, Unique, OneToMany } from "typeorm";

import Model from "./Model";
import ProjectMembers from "./ProjectMembers";

@Entity("users")
@Unique(["username", "email"])
export default class User extends Model {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @OneToMany(() => ProjectMembers, (projectMembers) => projectMembers.user)
  projectMembers: ProjectMembers[];

  toJSON(): any {
    return { ...this, id: undefined, hash: undefined };
  }
}
