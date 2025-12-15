import { HashPassword } from "./auth.js";
import { User } from "./models.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

if (
  !(await User.findOne()) &&
  process.env.DEFAULT_ADMIN_NAME &&
  process.env.DEFAULT_ADMIN_PASSWORD
) {
  await User.create({
    name: process.env.DEFAULT_ADMIN_NAME,
    password: HashPassword(process.env.DEFAULT_ADMIN_PASSWORD),
    isAdmin: true,
  });
  console.log(
    `Created default admin user with name "${process.env.DEFAULT_ADMIN_NAME}" and password "${process.env.DEFAULT_ADMIN_PASSWORD}"`,
  );
}
