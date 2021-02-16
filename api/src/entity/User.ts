import { Column, Entity, Unique, OneToMany } from "typeorm";

import Model from "./Model";
import ProjectMembers from "./ProjectMembers";
import ProjectRequest from "./ProjectRequest";

@Entity("users")
@Unique(["username", "email"])
export default class User extends Model {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @OneToMany(() => ProjectMembers, (projectMembers) => projectMembers.user, {
    onDelete: "CASCADE",
    cascade: ["update"],
  })
  projectMembers: ProjectMembers[];

  @OneToMany(() => ProjectRequest, (projectRequest) => projectRequest.user)
  projectRequests: ProjectRequest[];

  toJSON(): any {
    return { ...this, id: undefined, hash: undefined };
  }
}
