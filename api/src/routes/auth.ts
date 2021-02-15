import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import User from "../entity/User";
import validateDto from "../middleware/validateDto";
import verifyToken from "../middleware/verifyToken";
import { authSignUpSchema, authLogInSchema } from "../dto/auth";
import cookieOptions from "../utils/cookieOptions";
import { AuthDataType } from "../types/authDataType";

const router = Router();

router.post("/signup", validateDto(authSignUpSchema), async (req: Request, res: Response) => {
  try {
    const { username, email, password }: TypeOf<typeof authSignUpSchema> = req.body;

    const checkEmail = await User.findOne({ email });
    const checkUsername = await User.findOne({ username });

    if (checkEmail) {
      return res.status(500).json({ msg: "email already exists" });
    } else if (checkUsername) {
      return res.status(500).json({ msg: "username already taken" });
    } else {
      const hash = await argon2.hash(password);
      const user = User.create({ username, email, hash });
      await user.save();

      jwt.sign({ uuid: user.uuid }, "secretkey", (err: Error, token: string) => {
        if (err) return res.status(500).json(err);

        res.cookie("token", token, cookieOptions);
        return res.json(user);
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/login", validateDto(authLogInSchema), async (req: Request, res: Response) => {
  try {
    const { credentials, password }: TypeOf<typeof authLogInSchema> = req.body;

    let user: User;
    let isValidPassword: boolean;

    if (credentials.includes("@")) {
      user = await User.findOne({ email: credentials });
    } else {
      user = await User.findOne({ username: credentials });
    }

    if (user) isValidPassword = await argon2.verify(user.hash, password);

    if (user && isValidPassword) {
      jwt.sign({ uuid: user.uuid }, "secretkey", (err: Error, token: string) => {
        if (err) return res.status(500).json(err);

        res.cookie("token", token, cookieOptions);
        return res.json(user);
      });
    } else {
      return res.status(500).json({ err: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/refresh", verifyToken(), async (req: Request, res: Response) => {
  try {
    const authData: AuthDataType = res.locals.authData;

    const user = await User.findOneOrFail({ uuid: authData.uuid });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
