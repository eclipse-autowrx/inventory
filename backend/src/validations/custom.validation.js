// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { slugify } = require('../utils/textProcessing');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const objectIdList = (value, helpers) => {
  const origin = value;
  const values = value.split(',');
  for (let i = 0; i < values.length; i += 1) {
    if (!values[i].match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.message('"{{#label}}" must be a list of valid mongo ids');
    }
  }
  return origin;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }

  return value;
};

const jsonString = (value, helpers) => {
  try {
    JSON.parse(value);
    return value;
  } catch (error) {
    return helpers.message('{{#label}} is invalid JSON string');
  }
};

const slug = (value, helpers) => {
  if (slugify(value) !== value) {
    return helpers.message('{{#label}} must be a slug-like string');
  }
  return value;
};

/**
 * Custom validation for date filter
 * Supports:
 * - Single date: "2025-01-01"
 * - Date range: "2025-01-01,2025-01-31"
 * - Greater than: ">2025-01-01"
 * - Less than: "<2025-01-01"
 */
const dateFilter = (value, helpers) => {
  const dateStr = value.toString().trim();

  // Check for operators
  if (dateStr.startsWith('>') || dateStr.startsWith('<')) {
    const dateValue = dateStr.substring(1);
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return helpers.message('{{#label}} must be a valid date');
    }
    return value;
  }

  // Check for date range
  if (dateStr.includes(',')) {
    const [startDate, endDate] = dateStr.split(',').map((d) => d.trim());
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return helpers.message('{{#label}} must be a valid date');
    }

    if (start > end) {
      return helpers.message('{{#label}} start date must be before end date');
    }

    return value;
  }

  // Check single date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return helpers.message('{{#label}} must be a valid date');
  }

  return value;
};

module.exports = {
  objectId,
  objectIdList,
  password,
  jsonString,
  slug,
  dateFilter,
};
