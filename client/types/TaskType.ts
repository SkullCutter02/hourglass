export type TaskType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  dueDate: string;
  notifiedTime: string;
  adminOnly: boolean;
};
