export type InviteType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  projectRequests: {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    project: {
      uuid: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string;
    };
  }[];
};
