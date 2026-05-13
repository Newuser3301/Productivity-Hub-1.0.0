# Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++ wine xvfb
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/dist ./dist
COPY --from=build /app/electron ./electron
COPY --from=build /app/public ./public
RUN npm install --omit=dev
VOLUME ["/app/data"]
CMD ["node", "server.js"]
