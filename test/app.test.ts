import { describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import InitializeApplication from "../src/app";

describe("POST /near/request", () => {
  const app = InitializeApplication();
  it("should respond with an error message for unsupport network.", async () => {
    const response = await supertest(app)
      .post("/near/request")
      .send({ address: "test-address", network: "net" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "server is unavailable",
    });
  });

  it("should respond with an error message for invalid input", async () => {
    const response = await supertest(app)
      .post("/near/request")
      .send({ address: "", network: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "address or network is required.",
    });
  });
});
