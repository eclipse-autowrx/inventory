/* eslint-disable security/detect-object-injection */
const { default: mongoose } = require('mongoose');
const { userService } = require('../services/interservice');
const logger = require('../config/logger');

/**
 *
 * @param {object} data
 * @param {string} projectionString
 * @returns {object}
 */
function dataProjection(data, projectionString) {
  if (!projectionString) {
    return data;
  }

  if (typeof data !== 'object' || data === null) {
    logger.error(`Invalid data for projection. Data value: ${data}`);
    throw new Error(`Invalid data for projection. Data must be an object.`);
  }

  if (typeof projectionString !== 'string') {
    throw new Error(`Projection must be a string. Projection value: ${projectionString}`);
  }

  const fields = projectionString.trim().split(/\s+/).filter(Boolean);

  // Id must be always included
  if (!fields.includes('id')) {
    fields.push('id');
  }

  const newData = {};
  fields.forEach((field) => {
    if (!(field in data)) {
      logger.error(`Invalid data for projection. Data value: ${data}`);
      throw new Error(`Field "${field}" does not exist in the data.`);
    }
    newData[field] = data[field];
  });

  return newData;
}

/**
 *
 * @param {string[]} fields
 * @param {mongoose.Document} document
 */
const validateFieldsAgainstDocument = (fields, document) => {
  fields.forEach((field) => {
    if (!(field in document)) {
      logger.error(`Missing field in the document. Document value: %o`, document);
      throw new Error(`Field "${field}" does not exist in the document.`);
    }
    const fieldValue = document[field];
    if (!fieldValue || typeof fieldValue !== 'object' || !mongoose.isValidObjectId(fieldValue)) {
      logger.error(`Field is not a valid ObjectId. Document value: %o`, document);
      throw new Error(`Field "${field}" with value ${fieldValue} is not a valid ObjectId.`);
    }
  });
};

class InterservicePopulateListDecorator {
  /**
   *
   * @param {(mongoose.Document | mongoose.Query)[]} docs
   */
  constructor(docs) {
    this.docs = docs;
    /** @type {Map<string, string>} */
    this.populateStages = new Map();

    const isQuery = docs instanceof mongoose.Query;
    let isArrayOfDocs = Array.isArray(docs) && docs.every((doc) => doc instanceof mongoose.Document);

    if (docs instanceof mongoose.Document) {
      this.docs = [docs];
      isArrayOfDocs = true;
    }

    if (!isQuery && !isArrayOfDocs) {
      throw new Error('Docs must be a Mongoose Query or an array of Mongoose Documents.');
    }
  }

  /**
   *
   * @param {string} field
   * @param {string} projection
   * @returns {InterservicePopulateListDecorator}
   */
  populate(field, projection) {
    this.populateStages.set(field, projection || '');
    return this;
  }

  /**
   *
   * @returns {Promise<mongoose.Document[]>}
   */
  async getPopulatedDocs() {
    if (this.populateStages.size === 0) {
      return this.docs;
    }

    if (this.docs instanceof mongoose.Query) {
      const queriedDocs = await this.docs.exec();
      if (!Array.isArray(queriedDocs)) {
        this.docs = [queriedDocs];
      } else {
        this.docs = queriedDocs;
      }
    }

    const docs = this.docs.map((item) => item._doc);
    const { populateStages } = this;

    // Validate documents
    docs.forEach((document) => validateFieldsAgainstDocument(Array.from(populateStages.keys()), document));

    /** @type {Map<string, Set<string>>} */
    const idsToPopulate = new Map();
    populateStages.forEach((_, field) => {
      idsToPopulate.set(field, new Set());
      docs.forEach((doc) => {
        const fieldValue = doc[field];
        idsToPopulate.get(field).add(String(fieldValue));
      });
    });

    const promises = [];

    /** @type {Map<string, User[]>} */
    const queryResults = new Map();

    idsToPopulate.forEach((ids, field) => {
      promises.push(
        userService.getUsers({ id: Array.from(ids).join(','), limit: 1000 }).then((data) => {
          const mapData = data.reduce((acc, user) => {
            acc.set(user.id, dataProjection(user, populateStages.get(field)));
            return acc;
          }, new Map());
          queryResults.set(field, mapData);
        }),
      );
    });

    // Execute all promises to fetch data for each populated field
    try {
      await Promise.all(promises);
      for (let i = 0; i < docs.length; i += 1) {
        const doc = docs[i];
        populateStages.forEach((_, field) => {
          doc[field] = queryResults.get(field)?.get(String(doc[field])) || null;
        });
      }
    } catch (error) {
      throw new Error(`Error while retrieving data: ${error.message}`);
    }

    return this.docs;
  }

  /**
   * @returns {Promise<mongoose.Document>}
   */
  async getSinglePopulatedDoc() {
    return (await this.getPopulatedDocs()).at(0);
  }
}

module.exports = InterservicePopulateListDecorator;
