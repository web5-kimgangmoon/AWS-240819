import request from "supertest";
import { config } from "dotenv";
import app from "./app";

config();

describe("testFunction", () => {
  test(`Get / return AWS's Members`, async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("AWS's Members");
  });
});
