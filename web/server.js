import express from "express";
import apiApp from "./api.js";

import dotenv from "dotenv";
dotenv.config({ quiet: true });

const app = express();

app.use(express.static("public"));
app.use("/api", apiApp);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening: http://localhost:${port}`));
