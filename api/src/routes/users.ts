import { Router, Request, Response } from "express";

import User from "../entity/User";
import Project from "../entity/Project";
import verifyToken from "../middleware/verifyToken";
import { AuthDataType } from "../types/AuthDataType";

const router = Router();

router.get("/projects", verifyToken(), async (req: Request, res: Response) => {
  try {
    const authData: AuthDataType = res.locals.authData;
    const user = await User.findOneOrFail(
      { uuid: authData.uuid },
      { relations: ["projectMembers", "projectMembers.project", "projectMembers.project.categories"] }
    );
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/admin/:projectUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { projectUuid } = req.params;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user"] }
    );

    const isAdmin = project.projectMembers.some(
      (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
    );

    return res.json(isAdmin);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/access/:projectUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { projectUuid } = req.params;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user"] }
    );

    const isMember = project.projectMembers.some((projectMember) => projectMember.user.uuid == authData.uuid);

    return res.json(isMember);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
