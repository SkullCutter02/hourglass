import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";

import Project from "../entity/Project";
import Category from "../entity/Category";
import Task from "../entity/Task";
import verifyToken from "../middleware/verifyToken";
import validateSchema from "../middleware/validateSchema";
import { postTaskSchema } from "../schemas/tasks";
import { AuthDataType } from "../types/authDataType";
import client from "../utils/redisClient";
import isDatePast from "../utils/isDatePast";

const router = Router();

router.post(
  "/:projectUuid",
  validateSchema(postTaskSchema),
  verifyToken(),
  async (req: Request, res: Response) => {
    try {
      const { projectUuid } = req.params;
      const { name, description, dueDate, adminOnly, categoryUuid }: TypeOf<typeof postTaskSchema> = req.body;
      const authData: AuthDataType = res.locals.authData;

      if (!isDatePast(dueDate)) {
        const project = await Project.findOneOrFail(
          { uuid: projectUuid },
          { relations: ["projectMembers", "projectMembers.user"] }
        );

        const hasAccess = project.projectMembers.some(
          (projectMember) => projectMember.user.uuid === authData.uuid
        );

        if (hasAccess) {
          const category = await Category.findOneOrFail({ uuid: categoryUuid });
          const task = Task.create({
            name,
            description: description ? description : "",
            dueDate,
            adminOnly: adminOnly ? adminOnly : false,
            category,
          });

          client.del(`projects_${project.uuid}`);
          await task.save();
          return res.json(task);
        } else {
          return res.status(403).json({ msg: "You do not have access to post a new task to this project" });
        }
      } else {
        return res.status(500).json({ msg: "Due date is in the past!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

module.exports = router;
