import { Router, Request, Response } from "express";

import Project from "../../entity/Project";
import User from "../../entity/User";
import ProjectRequest from "../../entity/ProjectRequest";
import ProjectMembers from "../../entity/ProjectMembers";
import verifyToken from "../../middleware/verifyToken";
import { AuthDataType } from "../../types/AuthDataType";
import client from "../../utils/redisClient";

const router = Router();

router.get("/invite", verifyToken(), async (req: Request, res: Response) => {
  try {
    const authData: AuthDataType = res.locals.authData;

    const user = await User.findOneOrFail(
      { uuid: authData.uuid },
      { relations: ["projectRequests", "projectRequests.project"] }
    );
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/invite/:username", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const projectUuid: string = req.body.projectUuid;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user"] }
    );
    const user = await User.findOne({ username });

    if (user) {
      const isAdmin = project.projectMembers.some(
        (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
      );

      const exists = project.projectMembers.some((projectMember) => projectMember.user.uuid === user.uuid);

      if (!exists) {
        if (isAdmin) {
          const findRequest = await ProjectRequest.findOne({ project, user });

          if (!findRequest) {
            const request = ProjectRequest.create({ project, user });
            await request.save();
            return res.json(request);
          } else {
            return res.status(500).json({ msg: "You already sent an invite to this user" });
          }
        } else {
          return res.status(403).json({ msg: "You do not have access to invite a user" });
        }
      } else {
        return res.status(500).json({ msg: "User is already a member of the group!" });
      }
    } else {
      return res.status(500).json({ msg: "User with such username does not exist" });
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

router.delete("/decline/:uuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const authData: AuthDataType = res.locals.authData;

    const request = await ProjectRequest.findOneOrFail({ uuid }, { relations: ["project", "user"] });

    if (authData.uuid === request.user.uuid) {
      await request.remove();
      return res.json({ msg: "Declined project invite" });
    } else {
      return res.status(403).json({ msg: "You do not have access to accept this project invite" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.patch("/leave/:projectUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { projectUuid } = req.params;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user"] }
    );

    if (project.projectMembers.length === 1 && project.projectMembers[0].user.uuid === authData.uuid) {
      await project.remove();
      return res.json({
        msg: "User left the project. Since user is the only member in this project, the project is deleted",
      });
    } else {
      const isAdmin = project.projectMembers.some(
        (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
      );

      project.projectMembers = project.projectMembers.filter(
        (projectMember) => projectMember.user.uuid !== authData.uuid
      );

      const user = await User.findOneOrFail({ uuid: authData.uuid });
      const projectMember = await ProjectMembers.findOneOrFail({ projectId: project.id, userId: user.id });
      await projectMember.remove();

      // if the user is an admin in the project, then randomly give another member in the project admin access
      if (isAdmin) {
        project.projectMembers[0].role = "admin";
      }

      await project.save();

      client.del(`projects_${project.uuid}`, (err: Error, _) => {
        if (err) throw err;
        return res.json({ msg: "User left the project" });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.delete("/kick/:userUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { userUuid } = req.params;
    const projectUuid: string = req.body.projectUuid;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user"] }
    );

    const isAdmin = project.projectMembers.some(
      (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
    );

    if (isAdmin) {
      if (userUuid === authData.uuid) {
        return res.status(500).json({ msg: "You can't kick yourself out of the project" });
      }

      client.del(`projects_${project.uuid}`, async (err: Error, _) => {
        const user = await User.findOneOrFail({ uuid: userUuid });
        const projectMember = await ProjectMembers.findOneOrFail({ projectId: project.id, userId: user.id });
        await projectMember.remove();

        if (err) throw err;
        return res.json({ msg: "Member successfully kicked out of the project" });
      });
    } else {
      return res.status(403).json({ msg: "You do not have access to kick a member out of the project" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
