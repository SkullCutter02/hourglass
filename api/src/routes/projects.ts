import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";

import Project from "../entity/Project";
import User from "../entity/User";
import ProjectMembers from "../entity/ProjectMembers";
import { createProjectSchema } from "../schemas/projects";
import validateSchema from "../middleware/validateSchema";
import verifyToken from "../middleware/verifyToken";
import { AuthDataType } from "../types/authDataType";
import client from "../utils/redisClient";

const router = Router();

router.get("/:uuid", (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;

    client.get(`projects_${uuid}`, async (err: Error, data) => {
      if (err) throw err;

      if (data !== null) {
        return res.json(JSON.parse(data));
      } else {
        const project = await Project.findOneOrFail(
          { uuid },
          { relations: ["projectMembers", "projectMembers.user"] }
        );
        client.setex(`projects_${uuid}`, 120, JSON.stringify(project));
        return res.json(project);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/", validateSchema(createProjectSchema), verifyToken(), async (req: Request, res: Response) => {
  try {
    const { name, description }: TypeOf<typeof createProjectSchema> = req.body;
    const authData: AuthDataType = res.locals.authData;

    const user = await User.findOneOrFail({ uuid: authData.uuid });

    const project = Project.create({ name, description });
    await project.save();

    const projectMember = ProjectMembers.create({ role: "admin", project, user });
    await projectMember.save();

    return res.json(projectMember);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
