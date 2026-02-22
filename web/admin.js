import { Log, User } from "./models.js";

export async function GetLogs(offset = 0) {
  if (typeof offset == "string") offset = parseInt(offset);
  const limit = 50;
  const result = await Log.findAndCountAll({
    limit,
    offset,
    include: { model: User, attributes: ["name"] },
    order: [["id", "DESC"]],
  });
  return {
    logs: result.rows,
    count: result.count,
    limit,
    offset,
  };
}
