FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your source code
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the port NestJS runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/main.js"]
