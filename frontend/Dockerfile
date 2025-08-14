FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy source code (including public directory)
COPY . .

# Expose port
EXPOSE 3000

# Set environment variable for React
ENV CI=false
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PORT=3000

# Default command (will be overridden by docker-compose)
CMD ["npm", "start"]
