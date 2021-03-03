import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import * as AWS from "aws-sdk";
import * as webpush from "web-push";

import { limiter } from "./middleware/rateLimit";
import { rescheduleNotifications } from "./services/scheduleNotifications";

webpush.setGCMAPIKey(process.env.GCM_API_KEY);
webpush.setVapidDetails(
  "malito:example@test.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

AWS.config.update({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: "us-east-2",
});

const app: express.Application = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"), limiter);
app.use("/projects/members", require("./routes/projects/members"), limiter);
app.use("/categories", require("./routes/categories"), limiter);
app.use("/tasks", require("./routes/tasks"), limiter);
app.use("/users", require("./routes/users"), limiter);

createConnection()
  .then(async () => {
    await app.listen(5000, () => console.log("Server started"));
    await rescheduleNotifications();
  })
  .catch((err) => console.log(err));
