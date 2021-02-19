import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import DashboardContainer from "../../components/containers/DashboardContainer";
import PageWithLayoutType from "../../components/layout/PageWithLayoutType";
import DashboardLayout from "../../components/layout/DashboardLayout";

const DashboardPage: React.FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/auth/access")
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (!data.access) {
          router.back();
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return <React.Fragment>{!isLoading && <DashboardContainer />}</React.Fragment>;
};

(DashboardPage as PageWithLayoutType).layout = DashboardLayout;

export default DashboardPage;
