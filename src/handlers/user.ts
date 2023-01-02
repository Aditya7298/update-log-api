import db from "../db";
import { hashPassword, createJWT, comparePassword } from "../modules/auth";

export const createUser = async (req, res) => {
  const { username, password } = req.body;

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

  res.status(200);
  res.json({ token });
};

export const signIn = async (req, res) => {
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
};
