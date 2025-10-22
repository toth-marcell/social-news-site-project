import { hashSync, compareSync } from "bcryptjs";
import { hash } from "crypto";

export const HashPassword = (pass) => {
  const lengthHashed = hash("sha256", pass);
  return hashSync(lengthHashed);
};

export const ComparePassword = (inputPass, hashedPass) => {
  const lengthHashed = hash("sha256", inputPass);
  return compareSync(lengthHashed, hashedPass);
};
