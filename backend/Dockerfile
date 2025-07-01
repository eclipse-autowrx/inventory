# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT

FROM node:20-alpine

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY package.json yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000
