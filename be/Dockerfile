FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify the build output exists
RUN ls -la dist/

EXPOSE 3000

# Generate Prisma client at runtime and start the application
CMD ["sh", "-c", "npx prisma generate && node dist/main.js"]
