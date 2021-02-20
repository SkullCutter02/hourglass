import React from "react";

import IndividualProjectContainer from "../../../components/containers/IndividualProjectContainer";
import PageWithLayoutType from "../../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const IndividualProjectPage: React.FC = () => {
  return <IndividualProjectContainer />;
};

(IndividualProjectPage as PageWithLayoutType).layout = DashboardLayout;

export default IndividualProjectPage;
