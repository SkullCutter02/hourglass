import React from "react";

import DashboardContainer from "../../components/containers/DashboardContainer";
import PageWithLayoutType from "../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../components/layout/DashboardLayout";

const DashboardPage: React.FC = () => {
  return <DashboardContainer />;
};

(DashboardPage as PageWithLayoutType).layout = DashboardLayout;

export default DashboardPage;
