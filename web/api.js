import express from "express";
import JWT from "jsonwebtoken";
import { Login, Register } from "./auth.js";
import { Log, Post, User } from "./models.js";
import { CreatePost, DeletePost, EditPost, GetPosts } from "./posts.js";

const router = express.Router();
export default router;

router.use(express.json());

router.use(async (req, res, next) => {
  try {
    const jwt = req.headers.authorization.replace(/^Bearer /, "");
    const id = JWT.verify(jwt, process.env.SECRET).id;
    const user = await User.findByPk(id);
    res.locals.user = user;
  } catch {
    res.locals.user = null;
  }
  next();
});

router.post("/register", async (req, res) => {
  const { name, password, about } = req.body;
  const result = await Register(name, password, about);
  res.status(result.status).json({ msg: result.msg });
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const result = await Login(name, password);
  res.status(result.status).json({ msg: result.msg, token: result.token });
});

router.get("/post", async (req, res) => {
  res.json(await GetPosts());
});

function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else res.status(401).json({ msg: "You must be logged in to do that!" });
}

router.post("/post", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const result = await CreatePost(
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user,
  );
  res.status(result.status).json({ msg: result.msg, id: result.id });
});

router.delete("/post/:id", LoggedInOnly, async (req, res) => {
  const result = DeletePost(req.params.id, res.locals.user);
  res.status(result.status).json({ msg: result.msg });
});

router.put("/post/:id", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const { id } = req.params.id;
  const result = await EditPost(
    id,
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user,
  );
  res.status(result.status).json({ msg: result.msg });
});

router.get("/me", LoggedInOnly, async (req, res) => {
  res.json(res.locals.user);
});

function AdminOnly(req, res, next) {
  if (res.locals.user && res.locals.user.isAdmin) next();
  else
    res
      .status(403)
      .json({ msg: "You must be logged in as an admin to do that!" });
}

router.get("/logs", AdminOnly, async (req, res) => {
  res.json(await Log.findAll());
});
