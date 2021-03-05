import * as yup from "yup";

// minimum 8 characters, at least one uppercase character and one number
const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/);

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
      message:
        "Password must be at least 8 characters long, and contain at least one uppercase letter, " +
        "one lowercase letter and one number",
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
      message:
        "Password must be at least 8 characters long, and contain at least one uppercase letter, " +
        "one lowercase letter and one number",
    })
    .required(),
});
