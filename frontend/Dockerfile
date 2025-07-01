# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT

# Stage 1: Build the React app with Node.js
FROM node:20-alpine AS base

FROM base AS builder

# Set the working directory in the container
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install the project dependencies
RUN yarn --frozen-lockfile

# Copy the rest of the project files to the working directory
COPY . .

# Build the project
RUN yarn build

# Stage 2: Serve the app 
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs 
RUN adduser --system --uid 1001 nextjs

# Copy the build output to the Nginx html directory
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose port 80
EXPOSE 3000

# Start Nginx
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
