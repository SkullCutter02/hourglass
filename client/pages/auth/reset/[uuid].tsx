import React from "react";
import { useRouter } from "next/router";

import ResetPasswordPageContainer from "../../../components/containers/ResetPasswordPageContainer";

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  return <ResetPasswordPageContainer uuid={uuid} />;
};

export default ResetPasswordPage;
