// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const convertUserHeader = (req, _, next) => {
  const userId = req.get('x-user-id');
  delete req.user;
  if (userId) {
    req.user = {
      id: userId,
    };
  }
  next();
};

module.exports = convertUserHeader;
