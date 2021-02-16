import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import * as AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: "us-east-2",
});

const app: express.Application = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/projects/members", require("./routes/projects/members"));

createConnection()
  .then(() => {
    app.listen(5000, () => console.log("Server started"));
  })
  .catch((err) => console.log(err));
