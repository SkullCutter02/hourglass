import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import * as AWS from "aws-sdk";
import * as webpush from "web-push";

import { limiter } from "./middleware/rateLimit";

AWS.config.update({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: "us-east-2",
});

const app: express.Application = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use("/projects/", limiter);
app.use("/categories/", limiter);
app.use("/tasks/", limiter);

app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/projects/members", require("./routes/projects/members"));
app.use("/categories", require("./routes/categories"));
app.use("/tasks", require("./routes/tasks"));

createConnection()
  .then(() => {
    app.listen(5000, () => console.log("Server started"));
  })
  .catch((err) => console.log(err));
