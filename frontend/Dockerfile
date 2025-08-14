FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy public directory first
COPY public/ ./public/

# Copy source files
COPY src/ ./src/

# Copy configuration files
COPY tailwind.config.js postcss.config.js ./

# Expose port
EXPOSE 3000

# Set environment variables for React
ENV CI=false
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PORT=3000

# Start the application
CMD ["npm", "start"]
