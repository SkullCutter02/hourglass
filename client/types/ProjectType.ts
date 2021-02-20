export type ProjectType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  projectMembers: {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    user: {
      uuid: string;
      createdAt: Date;
      updatedAt: Date;
      username: string;
      email: string;
    };
  }[];
  categories: {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    color: string;
    tasks: {
      uuid: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string;
      dueDate: string; // date format
      notifiedTime: number;
      adminOnly: boolean;
    }[];
  }[];
};
