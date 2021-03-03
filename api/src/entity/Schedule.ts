import { Entity, Column, OneToOne, JoinColumn } from "typeorm";

import Model from "./Model";
import Task from "./Task";

@Entity("schedules")
export default class Schedule extends Model {
  @Column()
  date: Date;

  @Column()
  subscription: string; // this column is JSON.stringified

  @OneToOne(() => Task, {
    cascade: ["remove"],
    onDelete: "CASCADE",
  })
  @JoinColumn()
  task: Task;
}
