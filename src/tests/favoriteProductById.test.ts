import { randomUUIDv7, redis } from "bun";
import { afterAll, afterEach, describe, expect, it, mock } from "bun:test";
import { addProduct, favoriteProductById } from "../products";
import { mockBunRequest } from "./mocks";

describe("favoriteProductById", async () => {
  afterEach(async () => {
    await redis.send("FLUSHALL", []);
  });

  const user_id = randomUUIDv7();
  const body = { product_name: "Iae", quantity: 3 };

  it("Should favorite with all right conditions", async () => {
    const addProdResponse = await addProduct(mockBunRequest({ body, endpoint: "/products", headers: { user_id } }));
    const {
      data: { product_id },
    } = (await addProdResponse.json()) as { data: { product_id: string } };
    const response = await favoriteProductById(
      mockBunRequest({ params: { id: product_id }, endpoint: `/products/favorites/${product_id}`, headers: { user_id } })
    );
    expect(response.status).toBe(200);
    const favorite = await redis.sismember(`user:${user_id}:product:favorites`, String(product_id));
    expect(favorite).toBeTrue();
  });

  it("Should error if product is already favorited", async () => {
    const addProdResponse = await addProduct(mockBunRequest({ body, endpoint: "/products", headers: { user_id } }));
    const {
      message,
      data: { product_id },
    } = (await addProdResponse.json()) as { message: string; data: { product_id: string } };

    await favoriteProductById(
      mockBunRequest({ params: { id: product_id }, endpoint: `/products/favorites/${product_id}`, headers: { user_id } })
    );
    const res = await favoriteProductById(
      mockBunRequest({ params: { id: product_id }, endpoint: `/products/favorites/${product_id}`, headers: { user_id } })
    );
    const resBody = (await res.json()) as { message: string };
    expect(res.status).toBe(409);
    expect(resBody?.message).toContain("Product already is favorited");
  });

  it("Should error if the product of the product_id does not exists", async () => {
    const randomId = randomUUIDv7();
    const res = await favoriteProductById(
      mockBunRequest({ params: { id: randomId }, endpoint: `/products/favorites/${randomId}`, headers: { user_id } })
    );
    const body = (await res.json()) as { message: string };
    expect(res.status).toBe(404);
    expect(body.message).toContain("Product does not exists");
  });
});
