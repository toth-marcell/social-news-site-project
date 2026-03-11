import fs from "fs";

export default function TeardownTest() {
  try {
    fs.renameSync("data/db.sqlite.bak", "data/db.sqlite");
  } catch {}
  try {
    fs.renameSync(".env.bak", ".env");
  } catch {}
}
