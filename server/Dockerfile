FROM node:22-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Copy schema first (needed for postinstall prisma generate)
COPY server/prisma ./prisma/

# Copy package files and install
COPY server/package*.json ./
RUN npm ci --ignore-scripts

# Generate Prisma Client
RUN ./node_modules/.bin/prisma generate

# Copy source and build
COPY server/tsconfig.json ./
COPY server/src ./src/
COPY server/scripts ./scripts/
COPY server/public ./public/
RUN ./node_modules/.bin/tsc

EXPOSE 3000

CMD ["/bin/sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && node dist/index.js"]
