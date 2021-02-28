import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";

import Project from "../entity/Project";
import Category from "../entity/Category";
import Task from "../entity/Task";
import verifyToken from "../middleware/verifyToken";
import validateSchema from "../middleware/validateSchema";
import { postTaskSchema, patchTaskSchema } from "../schemas/tasks";
import { AuthDataType } from "../types/AuthDataType";
import client from "../utils/redisClient";
import isDatePast from "../utils/isDatePast";
import { scheduleNotification } from "../services/scheduleNotifications";

const router = Router();

router.get("/:uuid", async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const task = await Task.findOneOrFail({ uuid }, { relations: ["category"] });
    return res.json(task);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/category/:categoryUuid", async (req: Request, res: Response) => {
  try {
    const category = await Category.findOneOrFail(
      { uuid: req.params.categoryUuid },
      { relations: ["tasks"] }
    );
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/:taskUuid", async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneOrFail(
      { uuid: req.params.taskUuid },
      { relations: ["category", "category.project"] }
    );
    return res.json(task);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post(
  "/:projectUuid",
  validateSchema(postTaskSchema),
  verifyToken(),
  async (req: Request, res: Response) => {
    try {
      const { projectUuid } = req.params;
      const {
        name,
        description,
        dueDate,
        notifiedTime,
        adminOnly,
        categoryUuid,
        subscription,
      }: TypeOf<typeof postTaskSchema> = req.body;
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
            notifiedTime,
            category,
          });

          client.del(`projects_${project.uuid}`);
          await task.save();

          if (subscription !== null) {
            await scheduleNotification(notifiedTime, task, subscription);
          }

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

router.patch(
  "/:taskUuid",
  validateSchema(patchTaskSchema),
  verifyToken(),
  async (req: Request, res: Response) => {
    try {
      const { taskUuid } = req.params;
      const {
        name,
        description,
        dueDate,
        notifiedTime,
        adminOnly,
        categoryUuid,
        subscription,
      }: TypeOf<typeof patchTaskSchema> = req.body;
      const authData: AuthDataType = res.locals.authData;

      if (!isDatePast(dueDate)) {
        const task = await Task.findOneOrFail(
          { uuid: taskUuid },
          {
            relations: [
              "category",
              "category.project",
              "category.project.projectMembers",
              "category.project.projectMembers.user",
            ],
          }
        );

        const isMember = task.category.project.projectMembers.some(
          (projectMember) => projectMember.user.uuid === authData.uuid
        );

        if (isMember) {
          if (task.adminOnly) {
            const isAdmin = task.category.project.projectMembers.some(
              (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
            );

            if (!isAdmin) {
              return res
                .status(403)
                .json({ msg: "You do not have access to edit this task as this task is admin only" });
            }
          }

          const category = await Category.findOneOrFail({ uuid: categoryUuid });
          client.del(`projects_${task.category.project.uuid}`);

          task.name = name || task.name;
          task.description = description || task.description;
          task.dueDate = dueDate || task.dueDate;
          task.notifiedTime = notifiedTime || task.notifiedTime;
          task.adminOnly = adminOnly || task.adminOnly;
          task.category = category || task.category;

          await task.save();
          return res.json(task);
        } else {
          return res.status(403).json({ msg: "You do not have access to edit this task" });
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

router.delete("/:taskUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { taskUuid } = req.params;
    const authData: AuthDataType = res.locals.authData;

    const task = await Task.findOneOrFail(
      { uuid: taskUuid },
      {
        relations: [
          "category",
          "category.project",
          "category.project.projectMembers",
          "category.project.projectMembers.user",
        ],
      }
    );

    const isMember = task.category.project.projectMembers.some(
      (projectMember) => projectMember.user.uuid === authData.uuid
    );

    if (isMember) {
      if (task.adminOnly) {
        const isAdmin = task.category.project.projectMembers.some(
          (projectMember) => projectMember.user.uuid === authData.uuid && projectMember.role === "admin"
        );

        if (!isAdmin) {
          return res
            .status(403)
            .json({ msg: "You do not have access to delete this task as this task is admin only" });
        }
      }

      client.del(`projects_${task.category.project.uuid}`);
      await task.remove();
      return res.json({ msg: "Task successfully deleted" });
    } else {
      return res.status(403).json({ msg: "You do not have access to delete this task" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
