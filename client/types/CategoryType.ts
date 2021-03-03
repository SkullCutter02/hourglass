import { TaskType } from "./TaskType";

export type CategoryType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  tasks: TaskType[];
};
