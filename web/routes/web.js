import cookieParser from "cookie-parser";
import express from "express";
import WriteLog from "../middleware/log.js";
import {
  AdminOnly,
  CookieAuth,
  LoggedInOnly,
  LoggedOutOnly,
} from "../middleware/webAuth.js";
import { GetLogs, GetUsers } from "../models/admin.js";
import { EditUser, GetProfile, Login, Register } from "../models/auth.js";
import { Comment, User } from "../models/models.js";
import {
  ChildComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  EditComment,
  EditPost,
  GetComments,
  GetPost,
  GetPosts,
  GetSingleComment,
  TopComment,
  UpvoteComment,
  UpvotePost,
} from "../models/posts.js";

const router = express.Router();
export default router;

router.use(express.static("public"));
router.use(cookieParser());
router.use(CookieAuth);
router.use(WriteLog);
router.use(express.urlencoded());

router.get("/pico.css", (req, res) => {
  const filename = new URL(
    import.meta.resolve("@picocss/pico/css/pico.jade.min.css")
  ).pathname.replace(/^\/C:/, "");
  res.sendFile(filename, { dotfiles: "allow" });
});

router.get("/rules", (req, res) => res.render("rules"));

router.get("/", async (req, res) => {
  const result = await GetPosts(
    "hot",
    req.query.offset,
    req.query,
    res.locals.user
  );
  res.render("index", result);
});

router.get("/new", async (req, res) => {
  const result = await GetPosts(
    "new",
    req.query.offset,
    req.query,
    res.locals.user
  );
  res.render("index", result);
});

router.get("/top", async (req, res) => {
  const result = await GetPosts(
    "top",
    req.query.offset,
    req.query,
    res.locals.user
  );
  res.render("index", result);
});

router.get("/comments", async (req, res) => {
  const result = await GetComments(
    "hot",
    req.query.offset,
    req.query,
    res.locals.user
  );
  res.render("comments", result);
});

router.get("/comments/new", async (req, res) => {
  const result = await GetComments(
    "new",
    req.query.offset,
    req.query,
    res.locals.user
  );
  res.render("comments", result);
});

router.get("/comments/top", async (req, res) => {
  const result = await GetComments(
    "top",
    req.query.offset,
    req.query,
    res.locals.user
  );
  res.render("comments", result);
});

router.get("/posts/:id", async (req, res) => {
  const result = await GetPost(req.params.id, res.locals.user);
  if (result.status == 200) res.render("post", { post: result.post });
  else res.status(result.status).render("msg", { msg_fail: result.msg });
});

router.get("/register", LoggedOutOnly, (req, res) =>
  res.render("register", { name: "", password: "", confirmPassword: "" })
);
router.post("/register", LoggedOutOnly, async (req, res) => {
  const { name, password, confirmPassword } = req.body;
  if (password != confirmPassword)
    return res.render("register", {
      name,
      password,
      confirmPassword,
      msg_fail: "The password and confirm password fields don't match!",
    });
  const result = await Register(name, password);
  if (result.status == 200) {
    res.render("login", { name: "", password: "", msg: result.msg });
  } else {
    res.status(result.status).render("register", {
      name,
      password,
      confirmPassword,
      msg_fail: result.msg,
    });
  }
});

router.get("/login", LoggedOutOnly, (req, res) =>
  res.render("login", { name: "", password: "" })
);
router.post("/login", LoggedOutOnly, async (req, res) => {
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
  res.redirect(req.query.redirect || "/");
});

router.get("/users/:id", async (req, res) => {
  const profile = await GetProfile(req.params.id, res.locals.user);
  if (!profile) return res.render("msg", { msg_fail: "No such user!" });
  res.render("profile", {
    profile,
    name: profile.name,
    password: "",
    confirmPassword: "",
    email: profile.email,
    about: profile.about,
    isAdmin: profile.isAdmin,
  });
});

router.post("/users/:id", LoggedInOnly, async (req, res) => {
  const profile = await GetProfile(req.params.id, res.locals.user);
  if (!profile) return res.render("msg", { msg_fail: "No such user!" });
  const { isAdmin, name, password, confirmPassword, email, about } = req.body;
  if (password != confirmPassword)
    return res.render("profile", {
      profile,
      isAdmin,
      name,
      password,
      confirmPassword,
      email,
      about,
      msg_fail: "The password and confirm password fields don't match!",
    });
  const result = await EditUser(
    profile,
    isAdmin,
    name,
    password,
    email,
    about,
    res.locals.user
  );
  if (result.status == 200) return res.redirect(`/users/${req.params.id}`);
  res.render("profile", {
    profile,
    isAdmin,
    name,
    password,
    confirmPassword,
    email,
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
  const result = await GetPost(req.params.id, res.locals.user);
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
  const comment = await Comment.findByPk(req.params.id, { include: User });
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
  res.render("editComment", {
    id,
    text,
    msg_fail: result.msg,
    User: result.comment.User,
    UserId: result.comment.User.id,
  });
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

router.get("/admin/logs", LoggedInOnly, AdminOnly, async (req, res) => {
  const result = await GetLogs(req.query.offset);
  res.render("logs", result);
});

router.get("/admin/users", LoggedInOnly, AdminOnly, async (req, res) => {
  const result = await GetUsers(req.query.offset);
  res.render("users", result);
});

router.use((req, res, next) => {
  res.status(404).render("msg", { msg_fail: "Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("msg", { msg_fail: "Internal Server Error" });
});
