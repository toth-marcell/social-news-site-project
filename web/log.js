import { Log } from "./models.js";

export default async function WriteLog(req, res, next) {
  await Log.create({ path: req.path });
  next();
}
