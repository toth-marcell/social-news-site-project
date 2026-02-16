import cookieParser from "cookie-parser";
import express from "express";
import JWT from "jsonwebtoken";
import { EditUser, Login, Register } from "./auth.js";
import WriteLog from "./log.js";
import { User, Comment } from "./models.js";
import {
  ChildComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  EditComment,
  EditPost,
  GetPost,
  GetPosts,
  GetSingleComment,
  TopComment,
  UpvoteComment,
  UpvotePost,
} from "./posts.js";

const router = express.Router();
export default router;

router.use(express.static("public"));

router.get("/pico.css", (req, res) =>
  res.sendFile(
    import.meta.dirname + "/node_modules/@picocss/pico/css/pico.jade.min.css"
  )
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

router.use(WriteLog);
router.use(express.urlencoded());

router.get("/", async (req, res) =>
  res.render("index", { posts: await GetPosts(res.locals.user) })
);

router.get("/posts/:id", async (req, res) => {
  const result = await GetPost(req.params.id, res.locals.user);
  if (result.status == 200) res.render("post", { post: result.post });
  else res.status(result.status).render("msg", { msg_fail: result.msg });
});

router.get("/register", (req, res) =>
  res.render("register", { name: "", password: "" })
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
  res.render("login", { name: "", password: "" })
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

router.get("/users/:id", async (req, res) => {
  const profile = await User.findByPk(req.params.id);
  if (!profile) return res.render("msg", { msg_fail: "No such user!" });
  res.render("profile", {
    profile,
    name: profile.name,
    password: "",
    about: profile.about,
  });
});

function LoggedInOnly(req, res, next) {
  if (res.locals.user) next();
  else
    res
      .status(401)
      .render("msg", { msg_fail: "You must be logged in to do that!" });
}

router.post("/users/:id", LoggedInOnly, async (req, res) => {
  const profile = await User.findByPk(req.params.id);
  if (!profile) return res.render("msg", { msg_fail: "No such user!" });
  const { name, password, about } = req.body;
  const result = await EditUser(
    profile,
    name,
    password,
    about,
    res.locals.user
  );
  if (result.status == 200) return res.redirect(`/users/${req.params.id}`);
  res.render("profile", {
    profile: res.locals.user,
    name,
    password,
    about,
    msg_fail: result.msg,
  });
});

router.get("/newpost", LoggedInOnly, (req, res) =>
  res.render("newPost", {
    title: "",
    link: "",
    linkType: "",
    text: "",
    category: "",
  })
);
router.post("/newpost", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const result = await CreatePost(
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user
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

router.get("/editpost/:id", LoggedInOnly, async (req, res) => {
  const result = await GetPost(req.params.id);
  if (result.status == 200) res.render("editPost", result.post);
  else res.status(result.status).render("msg", { msg_fail: result.msg });
});

router.post("/editpost/:id", LoggedInOnly, async (req, res) => {
  const { title, link, linkType, text, category } = req.body;
  const result = await EditPost(
    req.params.id,
    title,
    link,
    linkType,
    text,
    category,
    res.locals.user
  );
  if (result.status == 200) {
    res.redirect("/posts/" + req.params.id);
  } else {
    res.status(result.status).render("editPost", {
      id: req.params.id,
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

router.post("/posts/:id", LoggedInOnly, async (req, res) => {
  const { text } = req.body || {};
  const result = await TopComment(text, req.params.id, res.locals.user);
  if (result.status == 200) {
    res.redirect("/posts/" + req.params.id + "#c" + result.comment.id);
  } else
    res.status(result.status).render("post", {
      post: (await GetPost(req.params.id, res.locals.user)).post,
      msg_fail: result.msg,
    });
});

router.get("/comments/:id", LoggedInOnly, async (req, res) => {
  const result = await GetSingleComment(req.params.id, res.locals.user);
  if (result.status == 200) {
    res.render("commentPage", { comment: result.comment });
  } else res.status(result.status).render("msg", { msg_fail: result.msg });
});

router.post("/comments/:id", LoggedInOnly, async (req, res) => {
  const { text } = req.body || {};
  const result = await ChildComment(text, req.params.id, res.locals.user);
  if (result.status == 200) {
    res.redirect("/posts/" + result.comment.PostId + "#c" + result.comment.id);
  } else
    res.status(result.status).render("commentPage", {
      comment: (await GetSingleComment(req.params.id, res.locals.user)).comment,
      msg_fail: result.msg,
    });
});

router.get("/editcomment/:id", LoggedInOnly, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment)
    return res.status(404).render("msg", { msg_fail: "No such comment!" });
  if (!res.locals.user.isAdmin && comment.UserId != res.locals.user.id) {
    return res.status(403).render("msg", {
      msg_fail: "You can only edit your own comments, unless you are an admin.",
    });
  }
  res.render("editComment", comment.get());
});

router.post("/editcomment/:id", LoggedInOnly, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const result = await EditComment(id, text, res.locals.user);
  if (result.status == 200) return res.redirect(`/comments/${req.params.id}`);
  res.render("editComment", { id, text, msg_fail: result.msg });
});

router.post("/deletecomment/:id", LoggedInOnly, async (req, res) => {
  const result = await DeleteComment(req.params.id, res.locals.user);
  if (result.status == 200) {
    res.status(result.status).render("msg", { msg: result.msg });
  } else {
    res.status(result.status).render("msg", {
      msg_fail: result.msg,
      links: [{ href: "/comments/" + req.params.id, text: "Go back" }],
    });
  }
});

router.post("/postVote/:id", LoggedInOnly, async (req, res) => {
  await UpvotePost(req.params.id, res.locals.user);
  const redirectUrl = req.query.redirect || `/posts/${req.params.id}`;
  res.redirect(redirectUrl);
});

router.post("/commentVote/:id", LoggedInOnly, async (req, res) => {
  const result = await UpvoteComment(req.params.id, res.locals.user);
  const redirectUrl =
    req.query.redirect ||
    `/posts/${result.comment.PostId}#c${result.comment.id}`;
  res.redirect(redirectUrl);
});
