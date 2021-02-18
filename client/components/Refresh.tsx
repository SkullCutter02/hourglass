import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import userState from "../state/userState";

const Refresh: React.FC = () => {
  const setUserState = useSetRecoilState(userState);

  useEffect(() => {
    fetch("/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.msg) {
          setUserState(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return <div />;
};

export default Refresh;
