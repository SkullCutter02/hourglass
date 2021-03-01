import React from "react";
import { useRouter } from "next/router";

const EditTaskContainer: React.FC = () => {
  const router = useRouter();
  const { taskUuid } = router.query;

  return <div>{taskUuid}</div>;
};

export default EditTaskContainer;
