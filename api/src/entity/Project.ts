import { Entity, Column, OneToMany } from "typeorm";

import Model from "./Model";
import ProjectMembers from "./ProjectMembers";

@Entity("projects")
export default class Project extends Model {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ProjectMembers, (projectMembers) => projectMembers.project)
  projectMembers: ProjectMembers[];
}
