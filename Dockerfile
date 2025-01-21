FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-bullseye-slim AS runner
WORKDIR /app

# Install only the required runtime dependencies
RUN apt-get update && apt-get install -y \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"] 