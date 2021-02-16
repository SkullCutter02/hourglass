import { Router, Request, Response } from "express";

import Project from "../../entity/Project";
import User from "../../entity/User";
import ProjectRequest from "../../entity/ProjectRequest";
import verifyToken from "../../middleware/verifyToken";
import { AuthDataType } from "../../types/authDataType";

const router = Router();

router.post("/invite/:userUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { userUuid } = req.params;
    const projectUuid: string = req.body.projectUuid;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user"] }
    );
    const user = await User.findOneOrFail({ uuid: userUuid });

    const isAdmin = project.projectMembers.some(
      (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
    );

    if (isAdmin) {
      const request = ProjectRequest.create({ project, user });
      await request.save();
      return res.json(request);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
