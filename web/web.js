import express from "express";
import JWT from "jsonwebtoken";
import { User } from "./models.js";
import { GetPosts } from "./posts.js";
import cookieParser from "cookie-parser";
import { Login, Register } from "./auth.js";

const router = express.Router();
export default router;

router.use(express.static("public"));

router.get("/pico.css", (req, res) =>
  res.sendFile(
    import.meta.dirname + "/node_modules/@picocss/pico/css/pico.jade.min.css",
  ),
);

router.use(cookieParser());

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

router.use(express.urlencoded());

router.get("/", async (req, res) =>
  res.render("index", { posts: await GetPosts() }),
);

router.get("/register", (req, res) =>
  res.render("register", { name: "", password: "" }),
);
router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const result = await Register(name, password);
  if (result.status == 200) {
    res.render("login", { name: "", password: "", msg: result.msg });
  } else {
    res
      .status(result.status)
      .render("register", { name, password, msg_fail: result.msg });
  }
});

router.get("/login", (req, res) =>
  res.render("login", { name: "", password: "" }),
);
router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const result = await Login(name, password);
  if (result.status == 200) {
    res.cookie("token", result.token, { maxAge: 365 * 24 * 60 * 60 * 100 });
    res.redirect("/");
  } else {
    res
      .status(result.status)
      .render("login", { name, password, msg_fail: result.msg });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});
