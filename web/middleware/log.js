import { Log } from "../models/models.js";

export default async function WriteLog(req, res, next) {
  if (res.locals.user)
    res.locals.user.createLog({
      method: req.method,
      path: req.path,
    });
  else
    Log.create({
      method: req.method,
      path: req.path,
    });
  next();
}
