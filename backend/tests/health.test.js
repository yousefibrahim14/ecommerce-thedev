jest.mock("../src/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const app = require("../src/server");

describe("E-Commerce API health checks", () => {
  test("GET /health returns 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.message).toBe(
      "E-Commerce API is running"
    );
  });
});
