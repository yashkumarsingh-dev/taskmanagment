FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create the public directory and index.html file
RUN mkdir -p public
RUN echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Task Management System</title></head><body><div id="root"></div></body></html>' > public/index.html

# Copy source files
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
