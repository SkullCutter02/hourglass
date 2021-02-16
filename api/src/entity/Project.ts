import { Entity, Column, OneToMany } from "typeorm";

import Model from "./Model";
import ProjectMembers from "./ProjectMembers";
import ProjectRequest from "./ProjectRequest";

@Entity("projects")
export default class Project extends Model {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ProjectMembers, (projectMembers) => projectMembers.project, {
    onDelete: "CASCADE",
    cascade: ["update"],
  })
  projectMembers: ProjectMembers[];

  @OneToMany(() => ProjectRequest, (projectRequest) => projectRequest.project)
  projectRequests: ProjectRequest[];
}
