import { Request, Response, NextFunction } from "express";

const validateSchema = (resourceSchema) => async (req: Request, res: Response, next: NextFunction) => {
  const resource = req.body;

  try {
    await resourceSchema.validate(resource);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.errors.join(", ") });
  }
};

export default validateSchema;
