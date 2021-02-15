import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import User from "../entity/User";
import validateDto from "../middleware/validateDto";
import verifyToken from "../middleware/verifyToken";
import { authSignUpSchema, authLogInSchema, authSendEmailSchema } from "../dto/auth";
import { AuthDataType } from "../types/authDataType";
import cookieOptions from "../utils/cookieOptions";
import client from "../utils/redisClient";
import transporter from "../utils/transporter";

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

router.get("/refresh", verifyToken(), (req: Request, res: Response) => {
  try {
    const authData: AuthDataType = res.locals.authData; // from middleware verifyToken

    client.get(`user_${authData.uuid}`, async (err: Error, data: string) => {
      if (err) throw err;

      if (data !== null) {
        return res.json(JSON.parse(data)); // returns User if it is cached
      } else {
        const user = await User.findOneOrFail({ uuid: authData.uuid });
        client.setex(`user_${user.uuid}`, 1_209_600, JSON.stringify(user)); // 14 days
        return res.json(user);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/forgot", validateDto(authSendEmailSchema), async (req: Request, res: Response) => {
  try {
    const { email }: TypeOf<typeof authSendEmailSchema> = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const uniqueIdentifier = uuid();

      const storedObject = {
        uuid: uniqueIdentifier,
        userUuid: user.uuid,
      };

      client.setex(`forgot_${uniqueIdentifier}`, 1800, JSON.stringify(storedObject)); // 30 minutes

      transporter.sendMail(
        {
          from: "coolalan2016@gmail.com",
          to: email,
          subject: "Click here to change your password!",
          html: `<p>Hello! Please click this link to reset your password: ${process.env.HOST}/auth/reset/${uniqueIdentifier}</p>`,
        },
        (err: Error, info) => {
          if (err) throw err;
          return res.json(info);
        }
      );
    } else {
      return res.status(500).json({ msg: "user with such email doesn't exist" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
