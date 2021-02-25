import * as yup from "yup";

export const postTaskSchema = yup.object({
  name: yup.string().max(200).required(),
  description: yup.string().max(2000),
  dueDate: yup.date().required(),
  notifiedTime: yup.date(),
  adminOnly: yup.boolean(),
  categoryUuid: yup.string().uuid().required(),
  subscription: yup.mixed(),
});

export const patchTaskSchema = yup.object({
  name: yup.string().max(200),
  description: yup.string().max(2000),
  dueDate: yup.date(),
  adminOnly: yup.boolean(),
  categoryUuid: yup.string().uuid(),
});
