FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create public directory and index.html
RUN mkdir -p public
RUN echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Task Management System</title></head><body><div id="root"></div></body></html>' > public/index.html

# Create a simple favicon to prevent 500 errors
RUN echo '<!DOCTYPE html><html><head><link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📋</text></svg>"></head><body></body></html>' > public/favicon.ico

# Copy the rest of the application
COPY . .

# Copy configuration files
COPY tailwind.config.js postcss.config.js ./

# Expose port
EXPOSE 3000

# Set environment variables for React
ENV CI=false
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PORT=3000
ENV WDS_SOCKET_PATH=/ws
ENV CHOKIDAR_USEPOLLING=true
ENV FAST_REFRESH=false

# Start the application
CMD ["npm", "start"]
