import { Entity, ManyToOne } from "typeorm";

import Model from "./Model";
import User from "./User";
import Project from "./Project";

@Entity("project_request") // this entity is not a joint table
export default class ProjectRequest extends Model {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Project)
  project: Project;
}
