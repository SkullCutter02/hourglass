import { Entity, Column, OneToOne, JoinColumn } from "typeorm";

import Model from "./Model";
import Task from "./Task";

@Entity("schedules")
export default class Schedule extends Model {
  @Column()
  date: Date;

  @OneToOne(() => Task)
  @JoinColumn()
  task: Task;
}
