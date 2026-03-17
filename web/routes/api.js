import cors from "cors";
import express from "express";
import { AdminOnly, BearerAuth, LoggedInOnly } from "../middleware/apiAuth.js";
import WriteLog from "../middleware/log.js";
import { GetLogs } from "../models/admin.js";
import { EditUser, Login, Register } from "../models/auth.js";
import { User } from "../models/models.js";
import {
  ChildComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  EditComment,
  EditPost,
  GetPost,
  GetPosts,
  TopComment,
  UpvoteComment,
  UpvotePost,
} from "../models/posts.js";

const router = express.Router();
export default router;

router.use(express.json());
router.use(cors());
router.use(BearerAuth);
router.use(WriteLog);

router.post("/register", async (req, res) => {
  const { name, password, about } = req.body ?? {};
  const result = await Register(name, password, about);
  res.status(result.status).json({ msg: result.msg });
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body ?? {};
  const result = await Login(name, password);
  res.status(result.status).json({ msg: result.msg, token: result.token });
});

router.get("/posts", async (req, res) => {
  const result = await GetPosts("hot", req.query.offset, res.locals.user);
  res.json(result);
});

router.get("/posts/new", async (req, res) => {
  const result = await GetPosts("new", req.query.offset, res.locals.user);
  res.json(result);
});

router.post("/posts", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body ?? {};
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
  const { title, link, linkType, text, category } = req.body ?? {};
  const { id } = req.params;
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

router.post("/topComment", LoggedInOnly, async (req, res) => {
  const { text, PostId } = req.body ?? {};
  const result = await TopComment(text, PostId, res.locals.user);
  res.status(result.status).json({ msg: result.msg, id: result.comment.id });
});

router.post("/childComment", LoggedInOnly, async (req, res) => {
  const { text, ParentId } = req.body ?? {};
  const result = await ChildComment(text, ParentId, res.locals.user);
  res.status(result.status).json({ msg: result.msg, id: result.comment.id });
});

router.delete("/comments/:id", LoggedInOnly, async (req, res) => {
  const result = await DeleteComment(req.params.id, res.locals.user);
  res.status(result.status).json({ msg: result.msg });
});

router.put("/comments/:id", LoggedInOnly, async (req, res) => {
  const result = await EditComment(
    req.params.id,
    req.body ? req.body.text : null,
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
  const { isAdmin, name, password, about } = req.body ?? {};
  const result = await EditUser(
    res.locals.user,
    isAdmin,
    name,
    password,
    about,
    res.locals.user
  );
  res.status(result.status).json({ msg: result.msg });
});

router.get("/users/:id", async (req, res) => {
  const profile = await User.findByPk(req.params.id);
  if (!profile) return res.status(404).json({ msg: "No such user!" });
  res.json(profile);
});

router.put("/users/:id", LoggedInOnly, async (req, res) => {
  const profile = await User.findByPk(req.params.id);
  if (!profile) return res.status(404).json({ msg: "No such user!" });
  const { isAdmin, name, password, about } = req.body ?? {};
  const result = await EditUser(
    profile,
    isAdmin,
    name,
    password,
    about,
    res.locals.user
  );
  res.status(result.status).json({ msg: result.msg });
});

router.get("/logs", LoggedInOnly, AdminOnly, async (req, res) => {
  const result = await GetLogs(req.query.offset);
  res.json(result);
});

router.use((req, res, next) => {
  res.status(404).json({ msg: "Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});
