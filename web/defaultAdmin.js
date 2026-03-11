import { HashPassword } from "./auth.js";
import { User } from "./models.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const [user, created] = await User.findOrCreate({
  where: {
    name: process.env.DEFAULT_ADMIN_NAME,
  },
  defaults: {
    password: HashPassword(process.env.DEFAULT_ADMIN_PASSWORD),
    isAdmin: true,
  },
  lock: true,
});
if (created)
  console.log(
    `Created default admin user with name "${process.env.DEFAULT_ADMIN_NAME}" and password "${process.env.DEFAULT_ADMIN_PASSWORD}"`
  );
