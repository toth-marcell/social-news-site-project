import { expect, test } from "@jest/globals";
import fs from "fs";
import {} from "../utils/erd.js";

test("database diagram has been created", () => {
  expect(fs.existsSync("erd.svg")).toBe(true);
});
