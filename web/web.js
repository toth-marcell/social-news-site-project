import cookieParser from "cookie-parser";
import express from "express";
import JWT from "jsonwebtoken";
import { Login, Register } from "./auth.js";
import { User } from "./models.js";
import { CreatePost, DeletePost, GetPost, GetPosts } from "./posts.js";

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

router.get("/posts/:id", async (req, res) => {
  res.render("post", { post: await GetPost(req.params.id) });
});

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

function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else
    res
      .status(401)
      .render("msg", { msg_fail: "You must be logged in to do that!" });
}

router.get("/newpost", LoggedInOnly, (req, res) =>
  res.render("newPost", {
    title: "",
    link: "",
    linkType: "",
    text: "",
    category: "",
  }),
);
router.post("/newpost", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const result = await CreatePost(
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user,
  );
  if (result.status == 201) {
    res.redirect("/posts/" + result.id);
  } else {
    res.status(result.status).render("newPost", {
      title,
      link,
      linkType,
      text,
      category,
      msg_fail: result.msg,
    });
  }
});

router.post("/deletepost/:id", LoggedInOnly, async (req, res) => {
  const result = await DeletePost(req.params.id, res.locals.user);
  if (result.status == 200) {
    res.status(result.status).render("msg", { msg: result.msg });
  } else {
    res.status(result.status).render("msg", {
      msg_fail: result.msg,
      links: [{ href: "/posts/" + req.params.id, text: "Go back" }],
    });
  }
});
