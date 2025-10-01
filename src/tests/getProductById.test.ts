import { redis } from "bun";
import { afterAll, describe, it } from "bun:test";

describe("getProductById", async () => {
  afterAll(async () => {
    await redis.send("FLUSHALL", []);
  });
  it("Should error when not passing user id as header", () => {});
  it("Should return 404 if product does not exists", async () => {});
  it("Should return 403 when the user does not own the product", async () => {});
  it("Should return 200 and the product when it succeed", async () => {});
});
