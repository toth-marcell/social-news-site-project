import express from "express";
import apiRouter from "./api.js";

import { exit } from "process";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
if (!(process.env.PORT && process.env.SECRET, process.env.SITENAME)) {
  console.error("Not all required env variables set, see .env.example");
  exit(1);
}

const app = express();

import { readFileSync } from "fs";
import YAML from "yaml";
const APISpec = YAML.parse(readFileSync("openapi.yaml", "utf-8"));
APISpec.info.title = process.env.SITENAME + " API";
app.get("/openapi.json", (req, res) => {
  res.json(APISpec);
});

import swaggerUI from "swagger-ui-express";
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(null, { swaggerOptions: { url: "/openapi.json" } })
);

app.use(express.static("public"));
app.use("/api", apiRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Website at: http://localhost:${port}`);
  console.log(`API documentation at: http://localhost:${port}/api-docs`);
  console.log(`API at: http://localhost:${port}/api`);
});
