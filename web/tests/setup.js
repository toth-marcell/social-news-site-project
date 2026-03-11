import fs from "fs";

export default function SetupTest() {
  try {
    fs.renameSync("data/db.sqlite", "data/db.sqlite.bak");
  } catch {}
  try {
    fs.renameSync(".env", ".env.bak");
  } catch {}
  try {
    fs.rmSync("erd.svg");
  } catch {}
  fs.copyFileSync(".env.test", ".env");
}
