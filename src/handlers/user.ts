import db from "../db";
import { hashPassword, createJWT, comparePassword } from "../modules/auth";
import { ERROR_TYPE } from "../modules/errors/errorTypes";

export const createUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingUser = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUser) {
      res.status(400);
      res.json({
        message: "User with the chosen username already exists.",
      });
    }

    const user = await db.user.create({
      data: {
        username,
        password: await hashPassword(password),
      },
    });

    const token = createJWT(user);

    res.status(200).json({ token });
  } catch (e) {
    e.type = ERROR_TYPE.INPUT;
    next(e);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(401);
      res.json({
        message: "User not found.",
      });
    }

    if (await comparePassword(password, user.password)) {
      res.status(200);
      res.json({
        token: createJWT(user),
      });
    } else {
      res.status(401);
      res.json({
        message: "Invalid Password.",
      });
    }
  } catch (e) {
    e.type = ERROR_TYPE.AUTH;
    next(e);
  }
};
