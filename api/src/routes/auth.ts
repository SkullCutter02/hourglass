import { Router, Request, Response } from "express";
import type { TypeOf } from "yup";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import User from "../entity/User";
import validateDto from "../middleware/validateDto";
import { authSignUpSchema } from "../dto/auth";

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
        if (err) throw err;

        res.cookie("token", token, { httpOnly: true, maxAge: 2_592_000_000 }); // 30 days
        return res.json({ token, user });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;
