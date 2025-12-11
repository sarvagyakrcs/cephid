# syntax=docker/dockerfile:1

# ---- Base ----
FROM oven/bun:1 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

# ---- Builder ----
FROM base AS builder

# Install protoc for proto generation
RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
COPY proto/ /proto/

# Generate proto types (use absolute path in Docker)
RUN protoc --proto_path=/proto --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/generated --ts_proto_opt=outputServices=grpc-js --ts_proto_opt=esModuleInterop=true /proto/*.proto

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ---- Runner ----
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets (run as root, simpler for slim image)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
