import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePassword = (password, hashedPassword): Promise<boolean> =>
  bcrypt.compare(password, hashedPassword);

export const hashPassword = (password): Promise<string> =>
  bcrypt.hash(password, 5);

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );

  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Unauthorized" });
    return;
  }

  try {
    const [, token] = bearer.split(" ");

    if (!token) {
      res.status(401);
      res.json({ message: "Invalid Token" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (e) {
    res.status(401);
    res.json({ message: "Invalid Token" });
    console.log(e);
  }
};
