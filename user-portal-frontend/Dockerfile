# Stage 1: Build React frontend
FROM node:18-alpine AS build

WORKDIR /usr/user-portal-frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --from=build /usr/user-portal-frontend/build /usr/share/nginx/html/user-portal-frontend

# Copy custom Nginx config if using path-based routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
