import { expect, test } from "@jest/globals";
import { ComparePassword, HashPassword } from "../auth.js";

test("password hashing", () => {
  const hash = HashPassword("abcd");
  expect(ComparePassword("abcd", hash)).toBe(true);
  expect(ComparePassword("mmmm", hash)).toBe(false);
});
