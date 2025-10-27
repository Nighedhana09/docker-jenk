# Use Node 18 LTS
FROM node:18-alpine

WORKDIR /usr/backend

# Copy package.json first for caching
COPY package*.json ./

# Install all dependencies including devDependencies for nodemon
RUN npm install

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
