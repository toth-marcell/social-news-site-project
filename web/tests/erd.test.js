import { expect, test } from "@jest/globals";
import fs from "fs";
import {} from "../erd.js";

test("database diagram has been created", () => {
  expect(fs.existsSync("erd.svg")).toBe(true);
});
