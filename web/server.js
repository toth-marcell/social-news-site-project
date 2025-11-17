import express from "express";
import apiApp from "./api.js";

import { exit } from "process";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
if (!(process.env.PORT && process.env.SECRET)) {
  console.error("Not all required env variables set, see .env.example");
  exit(1);
}

const app = express();

import { readFileSync } from "fs";
import swaggerUI from "swagger-ui-express";
import YAML from "yaml";
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(YAML.parse(readFileSync("openapi.yaml", "utf-8")))
);

app.use(express.static("public"));
app.use("/api", apiApp);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening: http://localhost:${port}`));
