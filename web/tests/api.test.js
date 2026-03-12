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

  describe("posts and comments", () => {
    const testPost = {
      title: "A great test post",
      text: "Some paragraphs go here.",
      category: "testing",
    };
    let id;
    test("creating a post", async () => {
      const res = await request(server)
        .post("/api/posts")
        .auth(token, { type: "bearer" })
        .set("content-type", "application/json")
        .send(testPost);
      expect(res.ok).toBe(true);
      expect(res.body.id).toBeGreaterThan(0);
      id = res.body.id;
    });
    test("get our post back", async () => {
      const res = await request(server)
        .get(`/api/posts/${id}`)
        .auth(token, { type: "bearer" });
      expect(res.body).toMatchObject(testPost);
      expect(res.body.voted).toBe(true);
      expect(res.body.votes).toBe(1);
    });
    test("removing our upvote works", async () => {
      const res = await request(server)
        .post(`/api/postVote/${id}`)
        .auth(token, { type: "bearer" });
      expect(res.ok).toBe(true);
      const res2 = await request(server)
        .get(`/api/posts/${id}`)
        .auth(token, { type: "bearer" });
      expect(res2.body.voted).toBe(false);
      expect(res2.body.votes).toBe(0);
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
