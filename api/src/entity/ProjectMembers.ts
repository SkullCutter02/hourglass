import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";

import User from "./User";
import Project from "./Project";

@Entity("project_members")
export default class ProjectMembers extends BaseEntity {
  @Column()
  role: "admin" | "member";

  @ManyToOne(() => Project, (project) => project.projectMembers, {
    primary: true,
    onDelete: "CASCADE",
    cascade: ["update"],
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectMembers, {
    primary: true,
    onDelete: "CASCADE",
    cascade: ["update"],
  })
  user: User;
}
