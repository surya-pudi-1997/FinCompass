# Use a Node.js base image for building the React application
FROM node:23-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's caching
COPY ../../../. .

# echo work directory contents
RUN ls -la

# Install dependencies
RUN npm install --workspaces


# Build the React application for production
RUN npm run build

# install serve package globally
RUN npm i serve -g

# Expose port 3000
EXPOSE 3000

# serve the build files
CMD ["serve", "-s", "dist", "-l", "3000"]