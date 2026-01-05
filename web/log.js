import { Log } from "./models.js";

export default async function WriteLog(req, res, next) {
  if (res.locals.user) res.locals.user.createLog({ path: req.path });
  else Log.create({ path: req.path });
  next();
}
