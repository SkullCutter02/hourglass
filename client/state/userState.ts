import { atom } from "recoil";

import { UserType } from "../types/UserType";

const userState = atom<UserType>({
  key: "userState",
  default: null,
});

export default userState;
