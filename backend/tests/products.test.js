jest.mock("../src/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const pool = require("../src/db");
const app = require("../src/server");

describe("Products API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/products returns products", async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          id: "1",
          name: "Laptop",
          price: "25000.00",
          stock: 9,
          category: "Electronics"
        }
      ]
    });

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Laptop");
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test("GET /api/products returns 500 if database query fails", async () => {
    pool.query.mockRejectedValue(new Error("Database unavailable"));

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe("Failed to fetch products");
  });
});
