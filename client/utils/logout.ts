import { NextRouter } from "next/router";

const logout = async (router: NextRouter) => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    await router.push("/");
  } catch (err) {
    console.log(err);
  }
};

export default logout;
