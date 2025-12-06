# Use Node 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /usr/backend

# Copy package.json first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
