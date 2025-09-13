# Redis Learning Projects with Bun — Personal Roadmap

I’m doing this to understand **Redis itself**—its data types, semantics, and operational behavior. The branches exist only as small experiments. I’m using Bun’s built‑in client (`Bun.redis`) to keep the setup minimal.

> **Real‑world usability:** Each experiment includes a small project that is usable in real scenarios (not just toy code). I’ll build them with the best of my current skills and a production‑leaning mindset, while keeping the primary goal: learning Redis.

> Each project title links to a branch in this repo that contains the experiment for that topic. (Links are placeholders until I push the branches.)

---

## [1) Fundamentals — Catalog, Favorites & Discovery](https://github.com/Miki000000/redis-experiments/tree/redis/basics)

**Learning Goals**
- **Strings**: atomic counters (`INCR`/`DECR`), read/write patterns, idempotent updates, and how counters interact with other structures.
- **Hashes**: field‑level updates (`HSET`), partial reads (`HMGET`/`HGETALL`), small‑hash memory behavior, and key naming conventions.
- **Lists**: head/tail operations (`LPUSH`/`RPUSH`, `LPOP`/`RPOP`), fixed‑length lists via `LPUSH` + `LTRIM`, and cost of ranged reads.
- **Sets**: membership and de‑duplication (`SADD`/`SREM`/`SISMEMBER`), cardinality, and typical read paths.
- **Sorted Sets**: score‑based ordering, `ZINCRBY`, range queries (`ZREVRANGE`, `ZRANGE BYSCORE`), score precision and tiebreak rules.
- Cross‑cutting: predictable key schemas, batching strategies for many reads, and basic consistency trade‑offs between counters, ranks, and lists.

---

## [2) TTL & Locks — Sessions, Rate Limit, Profile Lock]()

**Learning Goals**
- **Expiration**: `SETEX` vs `SET EX`, fixed vs “sliding” expiration patterns, overwriting TTL, and how expiration interacts with reads/writes.
- **Locks**: `SET key value NX PX ttl` as a simple lock, importance of a **unique value** for safe release, failure modes, and auto‑expiry as a safety net.
- **Rate limiting**: windowed counters (key design: `ip + route + window_ts`), setting `EXPIRE` on first hit, and hot‑key considerations.
- **Sessions**: trade‑offs of stateful session storage in Redis vs stateless tokens (rotation, invalidation, TTL management).

---

## [3) Pub/Sub — Lightweight Chat & Typing]()

**Learning Goals**
- **Pub/Sub semantics**: ephemeral delivery (no persistence, missed messages on disconnect), per‑subscriber ordering, and backpressure realities.
- **Operational shape**: one dedicated connection per subscriber, channel subscription patterns, and payload conventions.
- **Positioning**: when Pub/Sub is appropriate vs when to prefer Streams for durability/backlog needs.

---

## [4) Streams & Consumer Groups — Media Pipeline]()

**Learning Goals**
- **Streams core**: message IDs, `XADD`, trimming (`XTRIM`) to bound memory, and range scans.
- **Consumer Groups**: `XGROUP`, `XREADGROUP (>)`, pending lists, `XACK`, `XPENDING`, `XCLAIM`/`XAUTOCLAIM` (min‑idle), reclaim strategies.
- **Delivery model**: at‑least‑once semantics, idempotent handlers, retry/DLQ patterns, and monitoring basics for stuck/slow consumers.

---

## [5) Lua Scripts (Atomicity) — Checkout Stock Reservation]()

**Learning Goals**
- **Atomicity**: single‑script read‑validate‑update with `EVAL` to ensure all‑or‑nothing multi‑key changes.
- **Script patterns**: `KEYS`/`ARGV` contract, script SHA caching, determinism, and avoiding long‑running/blocking scripts.
- **Stock reservation use case**: atomic check‑then‑reserve, TTL‑based rollback, confirm/cancel flows; awareness of cluster key‑slot considerations.

---

### Scope

This repo is **not** about app design; it’s a place to learn Redis types, commands, and behaviors by running small, isolated experiments in Bun. Each branch ships a minimal yet usable project that demonstrates the Redis concept in a realistic scenario.

---

### Obs
- The only purpose of this repository is to learn and explore Redis. I’m intentionally not focusing on software architecture or formal best practices here (though I’ll keep things readable as best as I can).
- I’ll keep it simple and write descriptive commits. I won’t strictly follow branch or commit naming conventions (you should in real projects).

---

**License:** MIT
