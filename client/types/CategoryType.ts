import { TasksType } from "./TasksType";

export type CategoryType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  tasks: TasksType[];
};
