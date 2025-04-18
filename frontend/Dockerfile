# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend environment file
COPY frontend/.env ./.env

# Copy the rest of the frontend code
COPY frontend/ ./

# Expose port 5173
EXPOSE 5173


# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]