import React from "react";

import IndividualCategoryContainer from "../../../../../components/containers/IndividualCategoryContainer";
import PageWithLayoutType from "../../../../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";

const IndividualCategoryPage: React.FC = () => {
  return <IndividualCategoryContainer />;
};

(IndividualCategoryPage as PageWithLayoutType).layout = DashboardLayout;

export default IndividualCategoryPage;
