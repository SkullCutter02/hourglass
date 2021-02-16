import { Entity, Column, ManyToOne } from "typeorm";

import Model from "./Model";
import Project from "./Project";

@Entity("categories")
export default class Category extends Model {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Project, (project) => project.categories)
  project: Project;
}
