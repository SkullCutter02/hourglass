import * as yup from "yup";

export const postTaskSchema = yup.object({
  name: yup.string().max(200).required(),
  description: yup.string().max(2000),
  dueDate: yup.date().required(),
  adminOnly: yup.boolean(),
  categoryUuid: yup.string().uuid().required(),
});
