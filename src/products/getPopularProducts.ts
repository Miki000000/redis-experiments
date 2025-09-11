import { redis } from "bun";

export async function getPopularProducts(): Promise<Response> {
  const popular_products_id: string[] = await redis.send("ZREVRANGE", ["product:popular:rank", "0", "-1"]);
  const popular_products = await Promise.all(
    popular_products_id.map(async (id) => {
      const [product_id, user_id, product_name, quantity] = await redis.hmget(`product:${id}`, [
        "id",
        "user_id",
        "product_name",
        "quantity",
      ]);
      return {
        id: product_id,
        user_id,
        product_name,
        quantity,
      };
    })
  );
  return Response.json(popular_products, { status: 200 });
}
