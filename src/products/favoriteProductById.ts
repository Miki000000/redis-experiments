import { redis, type BunRequest } from "bun";
import { checkUserId } from "../shared/checkUserId";

export async function favoriteProductById(req: BunRequest<"/products/favorites/:id">): Promise<Response> {
  const { user_id } = checkUserId(req.headers.get("user_id"));
  const product_id = req.params.id;
  const [id, product_name, quantity] = await redis.hmget(`product:${product_id}`, ["id, product_name, quantity"]);
  if (!id || !product_name || quantity) return Response.json({ message: "Product does not exists" }, { status: 404 });

  const response = await redis.sadd(`user:${user_id}:product:favorites`, String(product_id));
  if (response === 0) return Response.json({ message: "Product already is favorited" }, { status: 409 });

  return Response.json({ message: "Product favorited" }, { status: 202 });
}
