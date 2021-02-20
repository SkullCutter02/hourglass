export type TasksType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  dueDate: string;
  notifiedTime: number;
  adminOnly: boolean;
};
