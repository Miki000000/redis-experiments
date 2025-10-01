import { randomUUIDv7, redis } from "bun";
import { test, describe, afterAll, it, expect } from "bun:test";
import { mockBunRequest } from "./mocks";
import { addProduct } from "../products";
import type { Product } from "../products/type";
import { getProductObject } from "./utils";

async function getZScore(product_id: string) {
  return (await redis.send("ZSCORE", ["product:popular:rank", product_id])) as number | null;
}

describe("addProduct", () => {
  afterAll(async () => {
    if (created_product_id) {
      await redis.send("FLUSHALL", []);
    }
  });

  const user_id = randomUUIDv7();
  const body = { product_name: "keyboard", quantity: "2" };

  let created_product_id: string | undefined;

  it("Should create product hash and add to popularity rank", async () => {
    const req = mockBunRequest({ body, endpoint: "/products", headers: { user_id } });
    const res = await addProduct(req);

    expect(res.status).toBe(201);
    const { data } = (await res.json()) as { message: string; data: { product_id: string } };
    const product_id = String(data.product_id);
    expect(product_id).toBeTruthy();
    created_product_id = product_id;

    const product = await getProductObject(created_product_id!);
    expect(product["id"]).toBe(created_product_id!);
    expect(product["user_id"]).toBe(user_id);
    expect(product["product_name"]).toBe(body.product_name);
    expect(product["quantity"]).toBe(String(body.quantity));

    const score = await getZScore(created_product_id!);
    expect(score).toBe(0);
  });

  it("Should fail if not passed user_id", async () => {
    const req = mockBunRequest({ body, endpoint: "/products" });
    expect(addProduct(req)).rejects.toThrow();
  });
});
