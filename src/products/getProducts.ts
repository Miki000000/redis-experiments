import type { BunRequest } from "bun";
import { getPopularProducts } from "./getPopularProducts";
import { getFavoriteProducts } from "./getFavoriteProducts";

export function getProducts(req: BunRequest) {
  const user_id = req.headers.get("user_id");
  const url = new URL(req.url);
  const getBy: string | null = url.searchParams.get("getBy");
  switch (getBy) {
    case "popular":
      return getPopularProducts();
    case "favorites":
      return getFavoriteProducts(user_id);
    default:
      return Response.json({ message: "Not found" }, { status: 404 });
  }
}
