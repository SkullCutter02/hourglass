import { Entity, Column } from "typeorm";

import Model from "./Model";

@Entity("tasks")
export default class Task extends Model {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column({ default: false })
  adminOnly: boolean;
}
