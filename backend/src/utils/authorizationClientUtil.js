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

  return {
    /**
     *
     * @param {string} query
     * @returns {Promise<boolean>}
     */
    async authorize(query) {
      try {
        await baseAxios.post('', {
          permissionQuery: query,
        });
        return true;
      } catch (error) {
        logger?.error(`Authorization error ${error.message}`);
        return false;
      }
    },

    /**
     *
     * @param {import('express').Request} req
     * @returns
     */
    extractUserIdFromHeader(req) {
      const userId = req.get('x-user-id');
      return userId;
    },

    /**
     *
     * @param {import('express').Request} req
     */
    extractObjectIdFromPath(req) {
      return req.params.id;
    },

    /**
     *
     * @param {string} query
     * @returns {Function}
     */
    checkPermissionByQuery(query) {
      return async (_, __, next) => {
        const allowed = await this.authorize(query);
        if (allowed) {
          next();
        } else {
          next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
      };
    },

    /**
     *
     * @param {string} act
     * @param {string | undefined} type
     * @returns
     */
    checkPermission(act, type) {
      return async (req, res, next) => {
        const userId = this.extractUserIdFromHeader(req);
        if (!userId) {
          return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
        const sub = `user:${userId}`;

        let query = `${sub}#${act}`;

        if (type) {
          const objectId = this.extractObjectIdFromPath(req);
          if (!objectId) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden. Cannot extract objectId.'));
          }
          query += `#${type}:${objectId}`;
        }

        return this.checkPermissionByQuery(query)(req, res, next);
      };
    },
  };
}

module.exports.newAuthorizationClient = newAuthorizationClient;
