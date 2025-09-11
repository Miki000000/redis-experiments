# Redis Fundamentals Project — Catalog, Favorites and Ranking

This project is just a learning exercise.
The goal is to practice the basic Redis data types (strings, hashes, lists, sets, zsets) by building a simple product catalog API.
It’s not meant to be production-ready — the idea is to understand how Redis commands fit into real use cases.

---

## What I wanted to learn

- **Hashes**: how to represent dictionaries/hashtables as key-value fields in Redis using `HMSET`, `HMGET`.
- **Strings**: how to use Redis strings not only for storing raw text, but also as atomic counters with commands like `INCR`.
- **Lists**: how to work with ordered collections that allow push/pop operations and trimming, useful for things like recents (`LPUSH`, `LTRIM`).
- **Sets**: how to store unique unordered collections and check membership efficiently with `SADD`, `SMEMBERS`, `SISMEMBER`.
- **Sorted Sets (ZSets)**: how to maintain ordered collections with a score, making it possible to rank elements dynamically with `ZADD`, `ZINCRBY`, `ZREVRANGE`.

---

## API Endpoints

The server runs on **Bun** with Redis as the database.
All requests require a `user_id` header.

### `POST /products/:id`
- Creates a new product.
- Stores it in a Redis **hash**.
- Initializes the product in the **popular ranking** zset with score `0`.

### `GET /products/:id`
- Returns product details.
- Validates product ownership by `user_id`.
- Increments product **views** (string counter).
- Updates **recents** list for the user (keeps max 50).
- Increments the product’s **popularity score** in the zset.
- Returns product info with current rank and views.

### `POST /products/favorites/:id`
- Adds a product to the user’s **favorites set**.
- If the product doesn’t exist, returns 404.
- If already favorited, returns 409.
- Otherwise, marks it as favorited.

### `GET /products?getBy=popular`
- Returns products sorted by popularity.
- Uses the **zset ranking** and loads product data from hashes.

### `GET /products?getBy=favorites`
- Returns all products that the user has favorited.
- Reads product ids from a **set**, then fetches product details from hashes.

---

## Redis Key Structure

- `product:{id}` → hash with `{ id, user_id, product_name, quantity }`
- `product:{id}:views` → string counter
- `user:{uid}:recents` → list (last 50 viewed products)
- `user:{uid}:product:favorites` → set of product ids
- `product:popular:rank` → zset for ranking products by views

---

## Development Steps

1. Implement product creation with **hashes** and initialize ranking in the **zset**.
2. Add product view counting with **strings**, and update the **zset** score.
3. Add favorites using **sets**.
4. Track recently viewed products with **lists**.
5. Expose all features through REST endpoints.

---

## Why this project exists

The purpose here is just to get comfortable with Redis by actually using it.
Instead of only reading docs, I wanted to see how each type behaves when applied to something tangible: a catalog, favorites, recents, and popularity ranking.

This way I can test commands step by step, break things, and really understand what Redis is doing behind the scenes.


## To reproduct use the information in [anotations](./ANOTATIONS.md)


### Obs:
- Unfortunately, I came up with this idea before creating the Git repository, so the branch for this specific project only contains a single commit. The next ones won’t be like this.
