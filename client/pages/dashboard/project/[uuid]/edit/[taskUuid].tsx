import React from "react";

import PageWithLayoutType from "../../../../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import EditTaskContainer from "../../../../../components/containers/EditTaskContainer";

const EditTaskPage: React.FC = () => {
  return <EditTaskContainer />;
};

(EditTaskPage as PageWithLayoutType).layout = DashboardLayout;

export default EditTaskPage;
