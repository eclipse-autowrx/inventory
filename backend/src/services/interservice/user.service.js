// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const axios = require('axios');
const config = require('../../config/config');

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} image_file
 */

/**
 *
 * @param {{
 * name: string,
 * role: string
 * page: number,
 * limit: number
 * sortBy: string
 * search: string,
 * includeFullDetails: boolean
 * id: string
 * }} options
 * @returns {Promise<User[]>}
 */
const getUsers = async (options) => {
  const response = await axios.get(config.services.user.url, {
    params: options,
  });

  return response.data?.results || [];
};

/**
 *
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUser = async (id) => {
  const response = await axios.get(`${config.services.user.url}/${id}`);
  return response.data;
};

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
