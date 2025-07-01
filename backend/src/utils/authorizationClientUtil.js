// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

/**
 *
 * @param {string} authorizeUrl
 * @param {{
 *  error: Function,
 * } | undefined} logger
 * @returns
 */
function newAuthorizationClient(authorizeUrl, logger) {
  const baseAxios = axios.create({
    baseURL: authorizeUrl,
  });

  const client = {
    /**
     * Authorize a user with a permission query, call as normal function
     * @param {string} query
     * @returns {Promise<boolean>}
     */
    async authorize(query, userId) {
      try {
        const response = await baseAxios.post('', {
          permissions: query,
          userId,
        });
        if (response.data && response.data[0] === true) {
          return true;
        }
        return false;
      } catch (error) {
        logger?.error(`Authorization error ${error.message}`);
        return false;
      }
    },

    /**
     * Use to extract User ID from request header
     * @param {import('express').Request} req
     * @returns
     */
    extractUserIdFromHeader(req) {
      const userId = req.get('x-user-id');
      return userId;
    },

    /**
     * Extract Object ID from request path parameters
     * @param {import('express').Request} req
     */
    extractObjectIdFromPath(req) {
      return req.params.id;
    },

    /**
     * Check if user is admin
     * @param {string} userId
     * @returns
     */
    isAdmin(userId) {
      return this.authorize('managerUsers', userId);
    },

    // /**
    //  * This is a middleware function to check permission by query.
    //  * @param {string} query
    //  * @returns {Function}
    //  */
    // checkPermissionByQuery(query) {
    //   return async (_, __, next) => {
    //     const allowed = await this.authorize(query);
    //     if (allowed) {
    //       next();
    //     } else {
    //       next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    //     }
    //   };
    // },

    // /**
    //  * This is a middleware function to check permission based on action and type.
    //  * @param {string} act
    //  * @param {string | undefined} type
    //  * @returns
    //  */
    // checkPermission(act, type) {
    //   return async (req, res, next) => {
    //     const userId = this.extractUserIdFromHeader(req);
    //     if (!userId) {
    //       return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    //     }
    //     const sub = `user:${userId}`;

    //     let query = `${sub}#${act}`;

    //     if (type) {
    //       const objectId = this.extractObjectIdFromPath(req);
    //       if (!objectId) {
    //         return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden. Cannot extract objectId.'));
    //       }
    //       query += `#${type}:${objectId}`;
    //     }

    //     return this.checkPermissionByQuery(query)(req, res, next);
    //   };
    // },
  };

  client.authorize = client.authorize.bind(client);
  client.extractUserIdFromHeader = client.extractUserIdFromHeader.bind(client);
  client.extractObjectIdFromPath = client.extractObjectIdFromPath.bind(client);
  // client.checkPermissionByQuery = client.checkPermissionByQuery.bind(client);
  // client.checkPermission = client.checkPermission.bind(client);

  return client;
}

module.exports.newAuthorizationClient = newAuthorizationClient;
