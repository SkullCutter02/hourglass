import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";

import Project from "../entity/Project";
import Category from "../entity/Category";
import verifyToken from "../middleware/verifyToken";
import { postCategorySchema } from "../schemas/categories";
import { AuthDataType } from "../types/authDataType";
import validateSchema from "../middleware/validateSchema";
import client from "../utils/redisClient";

const router = Router();

router.get("/:projectUuid", async (req: Request, res: Response) => {
  try {
    const { projectUuid } = req.params;
    const project = await Project.findOneOrFail({ uuid: projectUuid }, { relations: ["categories"] });
    return res.json(project);
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
        const exist = project.categories.some((category) => category.color === color);

        if (!exist) {
          client.del(`projects_${project.uuid}`, async (err: Error, _) => {
            if (err) throw err;
            const category = Category.create({
              name: name.toLowerCase(),
              color: color.toLowerCase(),
              project,
            });
            await category.save();
            return res.json(category);
          });
        } else {
          return res.status(500).json({ msg: "Color already exists within project" });
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

module.exports = router;
