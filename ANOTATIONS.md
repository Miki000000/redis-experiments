---
# 1) Fundamentals — **Catalog + Favorites + Ranking**

### Client Flow

1. **Catalog** → user opens the catalog and sees products with `name`, `quantity`, and owner (`user_id`).

2. **Product page** → opening a product:

   * increments product views (string counter),
   * updates popularity rank (zset),
   * adds product to the user’s **recents** list (max 50).

3. **Favorites** → user can add/remove products from their favorites set.

4. **Home** → shows **popular products** or **favorites** depending on query param.

---

### Redis Commands in Use

* **strings** → count views:

  ```ts
  await redis.incr(`product:${id}:views`)
  ```

* **hashes** → store product info:

  ```ts
  await redis.hmset(`product:${id}`, [...])
  await redis.hmget(`product:${id}`, ["id","product_name","quantity","user_id"])
  ```

* **lists** → track user recents (max 50):

  ```ts
  await redis.send("LPUSH", [`user:${uid}:recents`, id])
  await redis.send("LTRIM", [`user:${uid}:recents`, "0", "49"])
  ```

* **sets** → store favorites:

  ```ts
  await redis.sadd(`user:${uid}:product:favorites`, id)
  ```

* **zsets** → rank popular products:

  ```ts
  await redis.send("ZINCRBY", ["product:popular:rank", "1", id])
  await redis.send("ZREVRANGE", ["product:popular:rank", "0", "9"])
  ```

---

### Schema

* `product:{id}` → **hash**
  `{ id, user_id, product_name, quantity }`

* `user:{uid}:recents` → **list** (max 50)

* `user:{uid}:product:favorites` → **set**

* `product:{id}:views` → **string** counter

* `product:popular:rank` → **zset**

---

### Backend Endpoints

* `POST /products/:id`
  → create product (stores in hash, initializes zset score).

* `GET /products/:id`
  → returns product info, increments views, updates rank, pushes to recents.

* `POST /products/favorites/:id`
  → add to favorites set (conflict if already favorited).

* `GET /products?getBy=popular`
  → top products ranked by popularity (`ZREVRANGE`).

* `GET /products?getBy=favorites`
  → all products from the user’s favorites set.

---

### Dev Step-by-Step

1. **Seed products** (`hmset`).
2. **Views & popularity** (string + zset).
3. **Favorites** (set).
4. **Recents** (list).
5. **Queries** with `getBy=popular` or `getBy=favorites`.

---
