# # Use official Node.js image
# FROM node:24-alpine

# # Set working directory
# WORKDIR /app

# # 1. INSTALL SYSTEM BUILD TOOLS FIRST
# # These are required for node-gyp to compile native modules like better-sqlite3
# RUN apk add --no-cache python3 make g++ git

# # 2. Copy package files
# COPY package.json pnpm-lock.yaml ./

# # 3. Install pnpm globally
# RUN npm install -g pnpm

# # 4. Install dependencies (this will now succeed)
# RUN pnpm install

# # 5. Copy the rest of your app  .
# COPY . .

# # 6. Your app's start command
# CMD ["pnpm", "run", "dev"]




# Use official Bun image
FROM oven/bun:1.1-alpine

# Set working directory
WORKDIR /app

# 1. Install system build tools (for native deps)
# RUN apk add --no-cache python3 make g++ git

# 2. Copy lock & package files
COPY package.json ./

# 3. Install dependencies
RUN bun install

# 4. Copy the rest of the app
COPY . .

# 5. Run app
CMD ["bun", "run", "dev"]
