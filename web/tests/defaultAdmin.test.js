import { expect, test } from "@jest/globals";
import { User } from "../models/models.js";
import "../utils/defaultAdmin.js";

test("default admin has been created", async () => {
  const defaultAdmin = await User.findOne({
    where: { name: process.env.DEFAULT_ADMIN_NAME },
  });
  expect(defaultAdmin).not.toBeNull();
});
