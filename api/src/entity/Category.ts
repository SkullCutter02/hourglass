import { Entity, Column } from "typeorm";

import Model from "./Model";

@Entity("categories")
export default class Category extends Model {
  @Column()
  name: string;
}
