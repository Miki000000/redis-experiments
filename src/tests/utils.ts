import { redis } from "bun";
import type { Product } from "../products/type";

export async function getProductObject(product_id: string): Promise<Product> {
  const fields = ["id", "user_id", "product_name", "quantity"];
  const values = await redis.hmget(`product:${product_id}`, fields);
  const obj: Record<string, string | null> = {};
  fields.forEach((field, index) => {
    obj[field] = values[index] ?? null;
  });
  return obj as Product;
}
