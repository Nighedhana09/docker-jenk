# Stage 1: Build User Portal Frontend
FROM node:13-alpine AS build

WORKDIR /usr/user-portal-frontend

COPY . .
RUN rm -rf node_modules/ package-lock.json
RUN npm cache clean --force
RUN npm install 
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/user-portal-frontend/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
