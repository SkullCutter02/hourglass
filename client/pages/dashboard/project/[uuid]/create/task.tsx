import React from "react";

import CreateTaskContainer from "../../../../../components/containers/CreateTaskContainer";
import PageWithLayoutType from "../../../../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";

const CreateTaskPage: React.FC = () => {
  return <CreateTaskContainer />;
};

(CreateTaskPage as PageWithLayoutType).layout = DashboardLayout;

export default CreateTaskPage;
