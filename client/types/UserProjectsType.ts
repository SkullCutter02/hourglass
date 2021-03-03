export type UserProjectsType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  projectMembers: {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    role: "member" | "admin";
    project: {
      uuid: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string;
      categories: {
        uuid: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string;
      }[];
    };
  }[];
};
