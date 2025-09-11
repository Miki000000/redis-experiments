import { redis } from "bun";

export async function getFavoriteProducts(user_id: string | null): Promise<Response> {
  if (!user_id) {
    return new Response("Must provide a user id in the header", { status: 401 });
  }
  const favorite_products_id = await redis.smembers(`user:${user_id}:product:favorites`);
  const favorite_products = await Promise.all(
    favorite_products_id.map(async (id) => {
      const [product_id, user_id, product_name, quantity] = await redis.hmget(`product:${id}`, [
        "id",
        "user_id",
        "product_name",
        "quantity",
      ]);
      if (!product_id || !user_id || !product_name || !quantity) return;
      return {
        id: product_id,
        user_id,
        product_name,
        quantity,
      };
    })
  );
  return Response.json(favorite_products, { status: 200 });
}
