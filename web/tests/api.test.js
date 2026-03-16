import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import server from "../server.js";

const name = "testUser";
const password = "testPassword";
const about = "I'm a testing user!";
let token;

describe("API tests", () => {
  describe("auth and user test", () => {
    test("registering with missing fields fails", async () => {
      const res = await request(server).post("/api/register");
      expect(res.status).toBe(400);
    });

    test("registering works", async () => {
      const res = await request(server)
        .post("/api/register")
        .set("content-type", "application/json")
        .send({ name, password, about });
      expect(res.ok).toBe(true);
    });

    test("logging with wrong password fails", async () => {
      const res = await request(server)
        .post("/api/login")
        .set("content-type", "application/json")
        .send({ name, password: "idk" });
      expect(res.status).toBe(401);
    });

    test("logging in works", async () => {
      const res = await request(server)
        .post("/api/login")
        .set("content-type", "application/json")
        .send({ name, password });
      expect(res.ok).toBe(true);
      expect(res.body).toHaveProperty("msg");
      expect(res.body).toHaveProperty("token");
      token = res.body.token;
    });

    let UserId;

    test("can get our name and about back", async () => {
      const res = await request(server)
        .get("/api/me")
        .auth(token, { type: "bearer" });
      expect(res.ok).toBe(true);
      expect(res.body.name).toBe(name);
      expect(res.body.about).toBe(about);
      UserId = res.body.id;
    });

    test("can get our name and about, using our User id, and no auth", async () => {
      const res = await request(server).get(`/api/users/${UserId}`);
      expect(res.ok).toBe(true);
      expect(res.body.name).toBe(name);
      expect(res.body.about).toBe(about);
    });

    test("changing our about text", async () => {
      const res = await request(server)
        .put("/api/me")
        .auth(token, { type: "bearer" })
        .set("content-type", "application/json")
        .send({ name, about: "hello there" });
      expect(res.ok).toBe(true);
    });
  });

  let PostId;

  describe("posts", () => {
    const testPost = {
      title: "A great test post",
      text: "Some paragraphs go here.",
      category: "testing",
    };

    test("creating a post", async () => {
      const res = await request(server)
        .post("/api/posts")
        .auth(token, { type: "bearer" })
        .set("content-type", "application/json")
        .send(testPost);
      expect(res.ok).toBe(true);
      expect(res.body.id).toBeGreaterThan(0);
      PostId = res.body.id;
    });

    test("get our post back, and it has our vote by default", async () => {
      const res = await request(server)
        .get(`/api/posts/${PostId}`)
        .auth(token, { type: "bearer" });
      expect(res.body).toMatchObject(testPost);
      expect(res.body.voted).toBe(true);
      expect(res.body.votes).toBe(1);
    });

    test("removing our upvote works", async () => {
      const res = await request(server)
        .post(`/api/postVote/${PostId}`)
        .auth(token, { type: "bearer" });
      expect(res.ok).toBe(true);
      const res2 = await request(server)
        .get(`/api/posts/${PostId}`)
        .auth(token, { type: "bearer" });
      expect(res2.body.voted).toBe(false);
      expect(res2.body.votes).toBe(0);
    });

    test("cannot upvote nonexistent post", async () => {
      const res = await request(server)
        .post("/api/postVote/aaa")
        .auth(token, { type: "bearer" });
      expect(res.notFound).toBe(true);
    });

    test("editing a post", async () => {
      testPost.category = "moreTesting";
      const res = await request(server)
        .put(`/api/posts/${PostId}`)
        .auth(token, { type: "bearer" })
        .set("content-type", "application/json")
        .send(testPost);
      expect(res.ok).toBe(true);
      const res2 = await request(server)
        .get(`/api/posts/${PostId}`)
        .auth(token, { type: "bearer" });
      expect(res2.body).toMatchObject(testPost);
    });

    test("cannot edit nonexistent post", async () => {
      const res = await request(server)
        .put("/api/posts/bbbb")
        .auth(token, { type: "bearer" });
      expect(res.notFound).toBe(true);
    });
  });

  describe("comments", () => {
    let CommentId;
    let testComment;

    test("create a comment on our post", async () => {
      testComment = {
        text: "hello, this is a test comment",
        PostId,
      };
      const res = await request(server)
        .post("/api/topComment")
        .auth(token, { type: "bearer" })
        .set("content-type", "application/json")
        .send(testComment);
      expect(res.ok).toBe(true);
      expect(res.body.id).toBeGreaterThan(0);
      CommentId = res.body.id;
    });

    test("get our comment back, and it has our vote by default", async () => {
      const res = await request(server)
        .get(`/api/posts/${PostId}`)
        .auth(token, { type: "bearer" });
      const comment = res.body.Comments.find((x) => (x.id = CommentId));
      expect(comment).not.toBeUndefined();
      expect(comment).toMatchObject(testComment);
      expect(comment.voted).toBe(true);
      expect(comment.votes).toBe(1);
    });

    test("removing our upvote from the comment works", async () => {
      const res = await request(server)
        .post(`/api/commentVote/${PostId}`)
        .auth(token, { type: "bearer" });
      expect(res.ok).toBe(true);
      const res2 = await request(server)
        .get(`/api/posts/${PostId}`)
        .auth(token, { type: "bearer" });
      const comment = res2.body.Comments.find((x) => (x.id = CommentId));
      expect(comment).not.toBeUndefined();
      expect(comment.voted).toBe(false);
      expect(comment.votes).toBe(0);
    });

    test("cannot upvote nonexistent comment", async () => {
      const res = await request(server)
        .post("/api/commentVote/aaa")
        .auth(token, { type: "bearer" });
      expect(res.notFound).toBe(true);
    });

    test("cannot edit nonexistent comment", async () => {
      const res = await request(server)
        .put("/api/comments/bbbb")
        .auth(token, { type: "bearer" })
        .set("content-type", "application/json")
        .send({ text: "this will not be used" });
      expect(res.notFound).toBe(true);
    });
  });

  describe("admin routes", () => {
    test("cannot get logs without login", async () => {
      const res = await request(server).get("/api/logs");
      expect(res.unauthorized).toBe(true);
    });
    test("cannot get logs with non-admin account", async () => {
      const res = await request(server)
        .get("/api/logs")
        .auth(token, { type: "bearer" });
      expect(res.forbidden).toBe(true);
    });
    test("can get logs with admin account", async () => {
      const token = (
        await request(server)
          .post("/api/login")
          .set("content-type", "application/json")
          .send({
            name: process.env.DEFAULT_ADMIN_NAME,
            password: process.env.DEFAULT_ADMIN_PASSWORD,
          })
      ).body.token;
      const res = await request(server)
        .get("/api/logs")
        .auth(token, { type: "bearer" });
      expect(res.ok).toBe(true);
      expect(res.body).toHaveProperty("count");
      expect(res.body).toHaveProperty("limit");
      expect(res.body).toHaveProperty("logs");
      expect(res.body).toHaveProperty("offset");
      expect(res.body.offset).toBe(0);
    });
  });
});
