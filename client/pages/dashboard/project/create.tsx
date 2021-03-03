import React from "react";

import CreateProjectContainer from "../../../components/containers/CreateProjectContainer";
import PageWithLayoutType from "../../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const CreateProjectPage: React.FC = () => {
  return <CreateProjectContainer />;
};

(CreateProjectPage as PageWithLayoutType).layout = DashboardLayout;

export default CreateProjectPage;
