const request = require("supertest");
const app = require("../src/app");

describe("App", () => {
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("environment");
  });

  test("GET /api-docs should return 200 in development", async () => {
    const response = await request(app).get("/api-docs");
    expect(response.status).toBe(200);
  });

  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.status).toBe(404);
  });
});
