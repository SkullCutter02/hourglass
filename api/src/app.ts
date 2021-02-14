import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";

const app: express.Application = express();

app.use(express.json());

createConnection()
  .then(() => {
    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch((err) => console.log(err));
