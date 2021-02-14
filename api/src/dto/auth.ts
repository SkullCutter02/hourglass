import * as yup from "yup";

export const authSignUpSchema = yup.object({
  username: yup
    .string()
    .matches(/^[a-z0-9_-]+$/i, {
      message: "username can only contain letters, numbers, hyphens and underscores",
    })
    .required(), // only allow letters, numbers, underscores and hyphens
  email: yup.string().email().required(),
  password: yup
    .string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: "password must contain at least one uppercase letter and one number",
    })
    .required(), // minimum 8 characters, at least one uppercase character and one number
});
