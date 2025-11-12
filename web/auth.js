import { compareSync, hashSync } from "bcryptjs";
import { hash } from "crypto";
import JWT from "jsonwebtoken";
import { User } from "./models.js";

function HashPassword(pass) {
  const lengthHashed = hash("sha256", pass);
  return hashSync(lengthHashed);
}

function ComparePassword(inputPass, hashedPass) {
  const lengthHashed = hash("sha256", inputPass);
  return compareSync(lengthHashed, hashedPass);
}

export const Register = async (name, password, about) => {
  if (!(name && password))
    return {
      status: 400,
      msg: "You must fill out the name and password fields!",
    };
  if (await User.findOne({ where: { name } }))
    return { status: 400, msg: "That name is already taken!" };
  await User.create({ name, password: HashPassword(password), about });
  return { status: 200, msg: "Success! You can now log in." };
};

export const Login = async (name, password) => {
  if (!(name && password))
    return {
      status: 400,
      msg: "You must fill out the name and password fields!",
    };
  const user = await User.scope("includePassword").findOne({ where: { name } });
  if (user) {
    if (ComparePassword(password, user.password)) {
      return {
        status: 200,
        msg: "Success!",
        token: JWT.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: "1y",
        }),
      };
    }
    return { status: 400, msg: "Wrong password!" };
  }
  return { status: 404, msg: "No user exists with that name!" };
};
