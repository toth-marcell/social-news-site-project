import { Log } from "./models.js";

async function WriteLog(req, res, next) {
  await Log.create({ path: req.path });
  next();
}
export default WriteLog;
