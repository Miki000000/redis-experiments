FROM oven/bun:canary
WORKDIR /usr/src/app

COPY package.json bun.lockb* bun.lock* ./

RUN if [ -f package.json ]; then bun install --frozen-lockfile || bun install; fi

COPY . .

EXPOSE 3099

CMD ["bun", "test"]
