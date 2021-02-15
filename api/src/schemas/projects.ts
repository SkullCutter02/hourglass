import * as yup from "yup";

export const createProjectSchema = yup.object({
  name: yup.string().max(100).required(),
  description: yup.string().max(1000).required(),
});
