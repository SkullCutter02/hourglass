import * as yup from "yup";

// minimum 8 characters, at least one uppercase character and one number
const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);

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
    .matches(passwordRegex, {
      message: "Password must contain at least one uppercase letter and one number",
    })
    .required(),
});

export const authLogInSchema = yup.object({
  credentials: yup.string().required(),
  password: yup.string().required(),
});

export const authSendEmailSchema = yup.object({
  email: yup.string().email().required(),
});

export const authResetPassSchema = yup.object({
  uuid: yup.string().required(),
  password: yup
    .string()
    .matches(passwordRegex, {
      message: "Password must contain at least one uppercase letter and one number",
    })
    .required(),
});
