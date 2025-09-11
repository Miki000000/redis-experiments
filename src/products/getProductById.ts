import { redis, type BunRequest } from "bun";
import { checkUserId } from "../shared/checkUserId";

export async function getProductById(req: BunRequest<"/products/:id">): Promise<Response> {
  const { user_id } = checkUserId(req.headers.get("user_id"));
  const product_id = req.params.id;
  const [id, product_name, quantity, product_user_id] = await redis.hmget(`product:${product_id}`, [
    "id",
    "product_name",
    "quantity",
    "user_id",
  ]);

  if (!id || !product_name || !quantity) return Response.json({ message: "Not found" }, { status: 404 });
  if (product_user_id !== user_id) return Response.json({ message: "User does not own this product" }, { status: 401 });

  await redis.send("LPUSH", [`user:${user_id}:recents`, product_id]);
  await redis.send("LTRIM", [`user:${user_id}:recents`, "0", "49"]);

  const product_views = await redis.incr(`product:${product_id}:views`);

  await redis.send("ZINCRBY", ["product:popular:rank", "1", String(product_id)]);
  const product_rank = (await redis.send("ZREVRANK", ["product:popular:rank", String(product_id)])) as number;

  const product = {
    id,
    product_name,
    quantity: parseInt(quantity),
    product_views,
    product_rank,
  };
  return Response.json(product, { status: 200 });
}
