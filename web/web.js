import express from "express";
import JWT from "jsonwebtoken";
import { User } from "./models.js";
import { GetPosts } from "./posts.js";

const router = express.Router();
export default router;

router.use(express.static("public"));

router.get("/pico.css", (req, res) =>
  res.sendFile(
    import.meta.dirname + "/node_modules/@picocss/pico/css/pico.jade.min.css",
  ),
);

router.use(async (req, res, next) => {
  try {
    const jwt = req.cookies.token;
    const id = JWT.verify(jwt, process.env.SECRET).id;
    const user = await User.findByPk(id);
    res.locals.user = user;
  } catch {
    res.locals.user = null;
  }
  next();
});

router.get("/", async (req, res) =>
  res.render("index", { posts: await GetPosts() }),
);
router.get("/login", async (req, res) => res.render("login"));
