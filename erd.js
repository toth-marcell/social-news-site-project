import { writeFileSync } from "fs";
import sequelizeErd from "sequelize-erd";
import { sequelize } from "./models.js";

const svg = await sequelizeErd({
  source: sequelize,
});
writeFileSync("./erd.svg", svg);
