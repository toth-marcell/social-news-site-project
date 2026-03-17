import JWT from "jsonwebtoken";
import { User } from "../models/models.js";

export async function BearerAuth(req, res, next) {
  try {
    const jwt = req.headers.authorization.replace(/^Bearer /, "");
    const id = JWT.verify(jwt, process.env.SECRET).id;
    const user = await User.findByPk(id);
    res.locals.user = user;
  } catch {
    res.locals.user = null;
  }
  next();
}

export function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else res.status(401).json({ msg: "You must be logged in to do that!" });
}

export function AdminOnly(req, res, next) {
  if (res.locals.user.isAdmin) next();
  else
    res
      .status(403)
      .json({ msg: "You must be logged in as an admin to do that!" });
}
