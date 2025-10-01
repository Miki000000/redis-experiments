import { redis } from "bun";
import { afterAll, afterEach, describe, expect, it, mock } from "bun:test";
import { addProduct, favoriteProductById, getFavoriteProducts, getProducts } from "../products";
import { mockBunRequest } from "./mocks";
import type { Product } from "../products/type";

describe("getProducts", async () => {
  afterEach(async () => {
    await redis.send("FLUSHALL", []);
  });
  const user_id = Bun.randomUUIDv7();
  async function generateMockProducts(): Promise<string[]> {
    const promiseArr = Array.from({ length: 1000 }, async () => {
      const body = { product_name: "keyboard", quantity: "2" };
      const req = mockBunRequest({ body, endpoint: "/products", headers: { user_id } });
      const product = await addProduct(req);
      const respBody = (await product.json()) as { data: { product_id: string } };
      return respBody.data.product_id;
    });
    return await Promise.all(promiseArr);
  }

  async function favoriteProductList(product_ids: string[]) {
    const favoritingArr = product_ids.map((id) => {
      return favoriteProductById(mockBunRequest({ params: { id }, endpoint: `/products/favorites/${id}`, headers: { user_id } }));
    });
    return await Promise.all(favoritingArr);
  }
  it("Should error when not provided user_id on header", async () => {
    const req = mockBunRequest({ endpoint: `/products` });
    expect(getProducts(req)).rejects.toThrow();
  });
  it("Should give all products if not provide any url param", async () => {
    const products_ids = await generateMockProducts();
    const req = mockBunRequest({ endpoint: "/products", headers: { user_id } });
    const response = await getProducts(req);
    expect(response.status).toBe(200);
    const products = (await response.json()) as Product[];
    expect(products.length).toBeGreaterThanOrEqual(1000);
    const exProduct = { id: "", product_name: "", quantity: "", user_id: "" } as Product;
    expect(products).toBeTypeOf(typeof exProduct);
  });
  it("Should give favorite products", async () => {
    const product_ids = await generateMockProducts();
    const favorite_products = await favoriteProductList(product_ids.slice(0, 100));
    const req = mockBunRequest({ endpoint: "/products?getBy=popular", headers: { user_id } });

    const response = await getProducts(req);
    expect(response.status).toBe(200);
    const exProduct: Product[] = [{ id: "", product_name: "", quantity: "", user_id: "" }];
    const products = (await response.json()) as Product[];
    expect(products.length).toBeGreaterThanOrEqual(100);
    expect(products).toBeTypeOf(typeof exProduct);
  });
});
