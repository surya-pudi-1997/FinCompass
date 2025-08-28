# Stage 1: Build Node.js application
FROM node:23-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build your application if it has a build step (e.g., TypeScript compilation)
# If your Node.js app is just plain JS, you might not need a build step here.
# RUN npm run build

# Stage 2: Production-ready image
FROM node:23-alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/src/ ./src/ 
# Adjust this to your actual source directory

# If you had a build step, copy the build output as well
# COPY --from=build /app/dist/ ./dist/

# Expose the port your Node.js app listens on (e.g., 3000, 8080)
EXPOSE 8080

# Set environment variables for production
ENV NODE_ENV production

# Command to run your Node.js application
CMD ["node", "src/index.js"] # Adjust to your main entry file (e.g., server.js, app.js)