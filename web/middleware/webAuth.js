import JWT from "jsonwebtoken";
import { GetProfile } from "../models/auth.js";

export async function CookieAuth(req, res, next) {
  try {
    const jwt = req.cookies.token;
    const id = JWT.verify(jwt, process.env.SECRET).id;
    const user = await GetProfile(id);
    res.locals.user = user;
  } catch {
    res.locals.user = null;
  }
  next();
}

export function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else
    res
      .status(401)
      .render("msg", { msg_fail: "You must be logged in to do that!" });
}

export function AdminOnly(req, res, next) {
  if (res.locals.user.isAdmin) next();
  else
    res.status(403).render("msg", {
      msg_fail: "You must be logged in as an admin to do that!",
    });
}
