import { Entity, Column, ManyToOne } from "typeorm";

import Model from "./Model";
import Category from "./Category";

@Entity("tasks")
export default class Task extends Model {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column()
  notifiedTime: Date;

  @Column({ default: false })
  adminOnly: boolean;

  @ManyToOne(() => Category, (category) => category.tasks, {
    onDelete: "CASCADE",
  })
  category: Category;
}
