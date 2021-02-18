import React, { useEffect } from "react";
import { useRouter } from "next/router";

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/access")
      .then((res) => res.json())
      .then((data) => {
        if (!data.access) {
          router.back();
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return <div>Dashboard</div>;
};

export default DashboardPage;
