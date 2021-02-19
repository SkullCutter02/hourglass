import { NextPage } from "next";

import DashboardLayout from "./DashboardLayout";

type PageWithDashboardLayoutType = NextPage & { layout: typeof DashboardLayout };

type PageWithLayoutType = PageWithDashboardLayoutType;

export default PageWithLayoutType;
