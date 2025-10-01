import { redis, type BunRequest } from "bun";
import { getPopularProducts } from "./getPopularProducts";
import { getFavoriteProducts } from "./getFavoriteProducts";
import { checkUserId } from "../shared/checkUserId";
import type { Product } from "./type";

export async function getProducts(req: BunRequest) {
  const { user_id } = checkUserId(req.headers.get("user_id"));
  const url = new URL(req.url);
  const getBy: string | null = url.searchParams.get("getBy");
  switch (getBy) {
    case "popular":
      return await getPopularProducts();
    case "favorites":
      return await getFavoriteProducts(user_id);
    default:
      let cursor = "0";
      const allProductsId: string[] = [];
      for (;;) {
        const [nextCursor, keys]: [string, string[]] = await redis.send("SCAN", [cursor, "MATCH", "product:*", "COUNT", "1000"]);
        cursor = nextCursor;
        allProductsId.push(...keys);
        if (cursor === "0") break;
      }
      const products: Product[] = await Promise.all(
        allProductsId.map(async (id) => {
          const [product_id, user_id, product_name, quantity] = await redis.hmget(`product:${id}`, [
            "id",
            "user_id",
            "product_name",
            "quantity",
          ]);
          return { id: product_id, user_id, product_name, quantity } as Product;
        })
      );
      if (products.length <= 0) return Response.json({ message: "Not found" }, { status: 404 });
      return Response.json(products, { status: 200 });
  }
}
