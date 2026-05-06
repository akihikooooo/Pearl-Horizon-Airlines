FROM node:23-alpine AS dependencies
WORKDIR /apptemp
COPY package.json package-lock.json ./
RUN npm ci

FROM node:23-alpine AS build
WORKDIR /apptemp
COPY --from=dependencies /apptemp/ ./
COPY index.html vite.config.js .env.production ./
COPY --parents ./src ./
RUN npm run build

FROM busybox:latest AS deploy
WORKDIR /apptemp
COPY --from=build /apptemp/dist /apptemp/dist
CMD ["/bin/sh", "-c", "mkdir -p /app/www/frontend && cp -R /apptemp/dist/* /app/www/frontend/"]