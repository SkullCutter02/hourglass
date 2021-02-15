import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { AuthDataType } from "../types/authDataType";

const verifyToken = () => (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (typeof token !== "undefined") {
    jwt.verify(token, "secretkey", (err: Error, authData: AuthDataType) => {
      if (err) {
        return res.status(403).json({ msg: "Something went wrong" });
      } else {
        res.locals.authData = authData;
        next();
      }
    });
  } else {
    return res.status(403).json({ msg: "Access Forbidden" });
  }
};

export default verifyToken;
