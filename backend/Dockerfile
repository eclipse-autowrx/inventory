FROM node:20-alpine AS prune
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=prune /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]