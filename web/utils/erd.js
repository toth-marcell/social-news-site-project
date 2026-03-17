import { writeFileSync } from "fs";
import sequelizeErd from "sequelize-erd";
import { sequelize } from "../models/models.js";

const svg = await sequelizeErd({
  source: sequelize,
  engine: "fdp",
});
writeFileSync("./erd.svg", svg);
