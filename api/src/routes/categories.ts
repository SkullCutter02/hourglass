import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";

import Project from "../entity/Project";
import Category from "../entity/Category";
import verifyToken from "../middleware/verifyToken";
import { postCategorySchema, patchCategorySchema } from "../schemas/categories";
import { AuthDataType } from "../types/AuthDataType";
import validateSchema from "../middleware/validateSchema";
import client from "../services/redisClient";

const router = Router();

router.get("/:projectUuid", async (req: Request, res: Response) => {
  try {
    const { projectUuid } = req.params;
    const project = await Project.findOneOrFail({ uuid: projectUuid }, { relations: ["categories"] });
    return res.json(project.categories);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post(
  "/:projectUuid",
  validateSchema(postCategorySchema),
  verifyToken(),
  async (req: Request, res: Response) => {
    try {
      const { projectUuid } = req.params;
      const { name, color }: TypeOf<typeof postCategorySchema> = req.body;
      const authData: AuthDataType = res.locals.authData;

      const project = await Project.findOneOrFail(
        { uuid: projectUuid },
        { relations: ["projectMembers", "projectMembers.user", "categories"] }
      );

      const hasAccess = project.projectMembers.some(
        (projectMember) => projectMember.user.uuid === authData.uuid
      );

      if (hasAccess) {
        const exist = project.categories.some(
          (category) => category.color === color.toLowerCase() || category.name === name.toLowerCase()
        );

        if (!exist) {
          const category = Category.create({
            name: name.toLowerCase(),
            color: color.toLowerCase(),
            project,
          });
          await category.save();

          client.del(`projects_${project.uuid}`);
          return res.json(category);
        } else {
          return res
            .status(500)
            .json({ msg: "A category with such name or color already exists within project" });
        }
      } else {
        return res.status(403).json({ msg: "You do not have access to add a category to this project" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.patch(
  "/:categoryUuid",
  validateSchema(patchCategorySchema),
  verifyToken(),
  async (req: Request, res: Response) => {
    try {
      const { categoryUuid } = req.params;
      const { name, color, projectUuid }: TypeOf<typeof patchCategorySchema> = req.body;
      const authData: AuthDataType = res.locals.authData;

      const project = await Project.findOneOrFail(
        { uuid: projectUuid },
        { relations: ["projectMembers", "projectMembers.user", "categories"] }
      );

      const hasAccess = project.projectMembers.some(
        (projectMember) => projectMember.user.uuid === authData.uuid
      );

      if (hasAccess) {
        const exist = project.categories.some(
          (category) => category.color === color?.toLowerCase() || category.name === name?.toLowerCase()
        );

        if (!exist) {
          const category = await Category.findOneOrFail({ uuid: categoryUuid });

          category.name = name || category.name;
          category.color = color || category.color;

          await category.save();

          client.del(`projects_${project.uuid}`);
          return res.json(category);
        } else {
          return res
            .status(500)
            .json({ msg: "A category with such name of color already exists within project" });
        }
      } else {
        return res.status(403).json({ msg: "You do not have access to edit this category" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.delete("/:categoryUuid", verifyToken(), async (req: Request, res: Response) => {
  try {
    const { categoryUuid } = req.params;
    const projectUuid: string = req.body.projectUuid;
    const authData: AuthDataType = res.locals.authData;

    const project = await Project.findOneOrFail(
      { uuid: projectUuid },
      { relations: ["projectMembers", "projectMembers.user", "categories"] }
    );

    const hasAccess = project.projectMembers.some(
      (projectMember) => projectMember.user.uuid === authData.uuid
    );

    if (hasAccess) {
      const category = await Category.findOneOrFail({ uuid: categoryUuid });
      await category.remove();

      client.del(`projects_${project.uuid}`);
      return res.json({ msg: "Category is deleted successfully" });
    } else {
      return res.status(403).json({ msg: "You do not have access to delete this category" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
