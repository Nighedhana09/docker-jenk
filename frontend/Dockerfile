# Stage 1: Build Admin Frontend
FROM node:13-alpine AS build

WORKDIR /usr/frontend

COPY . .
RUN rm -rf node_modules/ package-lock.json
RUN npm cache clean --force
RUN npm install 
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/frontend/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
