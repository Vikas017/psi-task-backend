const request = require("supertest");
const app = require("../app");

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "admin@gmail.com",
      password: "123456"
    });

  token = res.body.token;
});

describe("Task API", () => {

  it("should create task (admin)", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        priority: "high"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });

  it("should get tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});