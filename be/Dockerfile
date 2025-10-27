FROM node:lts-alpine3.17

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# Run migrations, reset DB, seed, and start the app
CMD ["sh", "-c", "npm run db:deploy && npm run db:seed && node dist/main.js"]