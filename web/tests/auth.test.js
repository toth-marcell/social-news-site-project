import { describe, expect, test } from "@jest/globals";
import { ComparePassword, HashPassword } from "../models/auth.js";

describe("password hashing", () => {
  const hash = HashPassword("abcd");
  test("hash has correct format", () => {
    expect(hash).toMatch(/\$2b\$\d+\$.{22}.{31}/);
  });
  test("comparing correct password returns true", () => {
    expect(ComparePassword("abcd", hash)).toBe(true);
  });
  test("comparing wrong password returns false", () => {
    expect(ComparePassword("mmmm", hash)).toBe(false);
  });
});
