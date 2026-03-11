import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import server from "../server.js";

describe("api documentation", () => {
  test("openapi spec is available", async () => {
    const res = await request(server).get("/openapi.json");
    expect(res.ok).toBe(true);
    expect(res.type).toBe("application/json");
  });
  test("api documentation is running", async () => {
    const res = await request(server).get("/api-docs/");
    expect(res.ok).toBe(true);
    expect(res.type).toBe("text/html");
  });
});
