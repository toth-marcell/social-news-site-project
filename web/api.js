import express from "express";
import JWT from "jsonwebtoken";
import { Login, Register } from "./auth.js";
import { Post, User } from "./models.js";
const app = express();
export default app;

app.use(express.json());

app.use(async (req, res, next) => {
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

function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else res.status(401).json({ msg: "You must be logged in to do that!" });
}

app.post("/register", async (req, res) => {
  const { name, password, about } = req.body;
  const result = await Register(name, password, about);
  res.status(result.status).json({ msg: result.msg });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const result = await Login(name, password);
  res.status(result.status).json({ msg: result.msg, token: result.token });
});

app.get("/post", async (req, res) => {
  res.json(await Post.findAll());
});

app.post("/post", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  if (!(title && category))
    return res.status(400).json("The title and category must be filled!");
  if (!((link && linkType) || text))
    return res.status(400).json({
      msg: "The link and link type; or the text field must be filled.",
    });
  if ((link && !linkType) || (linkType && !link))
    return res
      .status(400)
      .json({ msg: "If the link is set the link type must be set too." });
  await Post.create({
    title,
    link: link == "" ? null : link,
    linkType: linkType == "" ? null : linkType,
    text: text == "" ? null : text,
    category,
    UserId: res.locals.user.id,
  });
  res.json({ msg: "Success!" });
});

app.delete("/post/:id", LoggedInOnly, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ msg: "No such post!" });
  if (!(post.UserId == res.locals.user.id || res.locals.user.isAdmin))
    return res.status(401).json({
      msg: "You can only delete your own posts, unless you are an admin.",
    });
  await post.destroy();
  res.json({ msg: "Success!" });
});

app.put("/post", LoggedInOnly, async (req, res) => {
  const { id, title, link, linkType, text, category } = req.body;
  const post = await Post.findByPk(id);
  if (!post) return res.status(404).json({ msg: "No such post!" });
  if (!(title || link || linkType || text || category))
    return res.status(400).json("Not changing anything.");
  if (title) await post.update({ title });
  if (link) await post.update({ link });
  if (linkType) await post.update({ linkType });
  if (text) await post.update({ text });
  if (category) await post.update({ category });
  res.json({ msg: "Success!" });
});

app.get("/me", LoggedInOnly, async (req, res) => {
  res.json(res.locals.user);
});
