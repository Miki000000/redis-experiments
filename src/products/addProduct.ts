import { redis, type BunRequest } from "bun";
import { checkUserId } from "../shared/checkUserId";

export async function addProduct(req: BunRequest<"/products">): Promise<Response> {
  const { user_id } = checkUserId(req.headers.get("user_id"));
  const { product_name, quantity } = (await req.json()) as {
    product_name: string;
    quantity: number;
  };
  const product_id = Bun.randomUUIDv7();
  const response = await redis.hmset(`product:${product_id}`, [
    "id",
    String(product_id),
    "user_id",
    String(user_id),
    "product_name",
    String(product_name),
    "quantity",
    String(quantity),
  ]);

  if (response !== "OK") return Response.json({ message: "Failed to add product" }, { status: 500 });

  await redis.send("ZADD", ["product:popular:rank", "0", product_id]);
  return Response.json({ message: `Product added with success: ${product_id}` }, { status: 201 });
}
