import * as yup from "yup";

export const postCategorySchema = yup.object({
  name: yup.string().max(50).required(),
  color: yup
    .string()
    .matches(/^#[0-9A-F]{6}$/i, {
      message: "Please enter a valid hex color with 6 digits",
    })
    .required(), // hex color regex matching
});

export const patchCategorySchema = yup.object({
  name: yup.string().max(50),
  color: yup.string().matches(/^#[0-9A-F]{6}$/i, {
    message: "Please enter a valid hex color with 6 digits",
  }),
  projectUuid: yup.string().uuid(),
});
