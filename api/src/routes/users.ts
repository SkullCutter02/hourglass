import { Router, Request, Response } from "express";

import User from "../entity/User";
import verifyToken from "../middleware/verifyToken";
import { AuthDataType } from "../types/authDataType";

const router = Router();

router.get("/projects", verifyToken(), async (req: Request, res: Response) => {
  try {
    const authData: AuthDataType = res.locals.authData;
    const user = await User.findOneOrFail(
      { uuid: authData.uuid },
      { relations: ["projectMembers", "projectMembers.project"] }
    );
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
