FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variable for React
ENV CI=false

# Default command (will be overridden by docker-compose)
CMD ["npm", "start"]
