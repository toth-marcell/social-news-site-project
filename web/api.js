import express from "express";
import JWT from "jsonwebtoken";
import { EditUser, Login, Register } from "./auth.js";
import WriteLog from "./log.js";
import { Log, User } from "./models.js";
import {
  CreatePost,
  DeletePost,
  EditPost,
  GetPost,
  GetPosts,
  UpvoteComment,
  UpvotePost,
} from "./posts.js";

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

router.use(WriteLog);

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

router.get("/posts", async (req, res) => {
  res.json(await GetPosts(res.locals.user));
});

function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else res.status(401).json({ msg: "You must be logged in to do that!" });
}

router.post("/posts", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const result = await CreatePost(
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user
  );
  res.status(result.status).json({ msg: result.msg, id: result.id });
});

router.get("/posts/:id", async (req, res) => {
  const result = await GetPost(req.params.id, res.locals.user);
  if (result.status == 200) res.json(result.post);
  else res.status(result.status).json({ msg: result.msg });
});

router.delete("/posts/:id", LoggedInOnly, async (req, res) => {
  const result = await DeletePost(req.params.id, res.locals.user);
  res.status(result.status).json({ msg: result.msg });
});

router.put("/posts/:id", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const { id } = req.params.id;
  const result = await EditPost(
    id,
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user
  );
  res.status(result.status).json({ msg: result.msg });
});

router.post("/postVote/:id", LoggedInOnly, async (req, res) => {
  const result = await UpvotePost(req.params.id, res.locals.user);
  res.status(result.status).json({ msg: result.msg });
});

router.post("/commentVote/:id", LoggedInOnly, async (req, res) => {
  const result = await UpvoteComment(req.params.id, res.locals.user);
  res.status(result.status).json({ msg: result.msg });
});

router.get("/me", LoggedInOnly, async (req, res) => {
  res.json(res.locals.user);
});

router.put("/me", LoggedInOnly, async (req, res) => {
  const { name, password, about } = req.body;
  const result = await EditUser(name, password, about, res.locals.user);
  res.status(result.status).json({ msg: result.msg });
});

function AdminOnly(req, res, next) {
  if (res.locals.user.isAdmin) next();
  else
    res
      .status(403)
      .json({ msg: "You must be logged in as an admin to do that!" });
}

router.get("/logs", LoggedInOnly, AdminOnly, async (req, res) => {
  res.json(await Log.findAll());
});
