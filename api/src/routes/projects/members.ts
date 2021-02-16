import { Router, Request, Response } from "express";

import Project from "../../entity/Project";
import User from "../../entity/User";
import ProjectRequest from "../../entity/ProjectRequest";
import ProjectMembers from "../../entity/ProjectMembers";
import verifyToken from "../../middleware/verifyToken";
import { AuthDataType } from "../../types/authDataType";
import client from "../../utils/redisClient";

const router = Router();

router.get("/invite/:userUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { userUuid: uuid } = req.params;

    const user = await User.findOneOrFail(
      { uuid },
      { relations: ["projectRequests", "projectRequests.project"] }
    );
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

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

router.post("/accept/:uuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const authData: AuthDataType = res.locals.authData;

    const request = await ProjectRequest.findOneOrFail({ uuid }, { relations: ["project", "user"] });

    if (authData.uuid === request.user.uuid) {
      await request.remove();

      const project = await Project.findOneOrFail({ uuid: request.project.uuid });
      const user = await User.findOneOrFail({ uuid: authData.uuid });

      const projectMember = ProjectMembers.create({ role: "member", project, user });
      await projectMember.save();

      client.del(`projects_${project.uuid}`, (err: Error, _) => {
        return res.json(projectMember);
      });
    } else {
      return res.status(403).json({ msg: "You do not have access to accept this project invite" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
