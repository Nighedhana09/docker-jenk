FROM node:18-alpine

WORKDIR /usr/backend

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

# Use your actual main file here
CMD ["node", "index.js"]
