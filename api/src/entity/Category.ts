import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

import Model from "./Model";
import Project from "./Project";
import Task from "./Task";

@Entity("categories")
export default class Category extends Model {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Project, (project) => project.categories)
  project: Project;

  @OneToMany(() => Task, (task) => task.category, {
    onDelete: "CASCADE",
  })
  tasks: Task[];
}
