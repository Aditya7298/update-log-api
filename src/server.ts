import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { body } from "express-validator";

import { router } from "./router";
import { protect } from "./modules/auth";
import { createUser, signIn } from "./handlers/user";
import { checkRequestForErrors } from "./modules/errors/checkRequestForErrors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api", protect, router);

app.post(
  "/user",
  body("username").isString(),
  body("password").isString(),
  checkRequestForErrors,
  createUser
);

app.post(
  "/signin",
  body("username").isString(),
  body("password").isString(),
  checkRequestForErrors,
  signIn
);

export default app;
