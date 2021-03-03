import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";

import User from "./User";
import Project from "./Project";

@Entity("project_members")
export default class ProjectMembers extends Model {
  @Column()
  role: "admin" | "member";

  @Column()
  projectId: number;

  @Column()
  userId: number;

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

  toJSON(): any {
    return { ...this, id: undefined, projectId: undefined, userId: undefined };
  }
}
