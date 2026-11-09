FROM node:22-alpine AS base

WORKDIR /app

# Instalar dependencias globales y de compilacion
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build && cp -r .medusa/server/public ./public 2>/dev/null || true

EXPOSE 9000

CMD ["npm", "run", "start"]
