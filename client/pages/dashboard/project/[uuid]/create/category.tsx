import React from "react";

import CreateCategoryContainer from "../../../../../components/containers/CreateCategoryContainer";
import PageWithLayoutType from "../../../../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";

const CreateCategoryPage: React.FC = () => {
  return <CreateCategoryContainer />;
};

(CreateCategoryPage as PageWithLayoutType).layout = DashboardLayout;

export default CreateCategoryPage;
