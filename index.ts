import { serve, type BunRequest } from "bun";
import { addProduct, favoriteProductById, getProductById, getProducts } from "./src/products";

serve({
  port: 3099,
  routes: {
    "/products/:id": {
      GET: async (req) => await getProductById(req),
    },
    "/products/favorites/:id": {
      POST: async (req) => favoriteProductById(req),
    },
    "/products": {
      POST: async (req) => await addProduct(req),
      GET: async (req) => await getProducts(req),
    },
  },
  error(error) {
    return new Response(`Request error: ${error.message}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
});

console.log("Servidor rodando na porta 3099");
