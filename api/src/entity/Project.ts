import { Entity, Column, OneToMany } from "typeorm";

import Model from "./Model";
import ProjectMembers from "./ProjectMembers";
import ProjectRequest from "./ProjectRequest";
import Category from "./Category";

@Entity("projects")
export default class Project extends Model {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => ProjectMembers, (projectMembers) => projectMembers.project, {
    onDelete: "CASCADE",
    cascade: ["update"],
  })
  projectMembers: ProjectMembers[];

  @OneToMany(() => ProjectRequest, (projectRequest) => projectRequest.project)
  projectRequests: ProjectRequest[];

  @OneToMany(() => Category, (category) => category.project)
  categories: Category[];
}
