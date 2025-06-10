const Joi = require('joi');
const { objectId } = require('./custom.validation');

const CARDINALITIES = ['one-to-one', 'zero-to-one', 'one-to-many', 'zero-to-many'];

const createRelation = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    is_core: Joi.boolean().default(false),
    type: Joi.string().required().trim(),
    description: Joi.string().trim().allow(''),
    source: Joi.string().custom(objectId).required(),
    target: Joi.string().custom(objectId).required(),
    source_cardinality: Joi.string()
      .valid(...CARDINALITIES)
      .allow(null),
    target_cardinality: Joi.string()
      .valid(...CARDINALITIES)
      .allow(null),
    source_role_name: Joi.string().allow(''),
    target_role_name: Joi.string().allow(''),
    metadata: Joi.any(),
  }),
};

const getRelations = {
  query: Joi.object().keys({
    name: Joi.string(),
    source_role_name: Joi.string(),
    target_role_name: Joi.string(),
    is_core: Joi.boolean(),
    source_cardinality: Joi.string().valid(...CARDINALITIES),
    target_cardinality: Joi.string().valid(...CARDINALITIES),
    type: Joi.string(),
    source: Joi.string().custom(objectId),
    target: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
  }),
};

const getRelation = {
  params: Joi.object().keys({
    relationId: Joi.string().custom(objectId).required(),
  }),
};

const updateRelation = {
  params: Joi.object().keys({
    relationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      // Only description, cardinality, properties are updatable
      description: Joi.string().trim().allow(''),
      name: Joi.string().trim(),
      is_core: Joi.boolean(),
      source_cardinality: Joi.string()
        .valid(...CARDINALITIES)
        .allow(null),
      target_cardinality: Joi.string()
        .valid(...CARDINALITIES)
        .allow(null),
      source_role_name: Joi.string().allow(''),
      target_role_name: Joi.string().allow(''),
      metadata: Joi.any(),
      type: Joi.string().trim(),
    })
    .min(1),
};

const deleteRelation = {
  params: Joi.object().keys({
    relationId: Joi.string().custom(objectId).required(),
  }),
};

module.exports.createRelation = createRelation;
module.exports.getRelations = getRelations;
module.exports.getRelation = getRelation;
module.exports.updateRelation = updateRelation;
module.exports.deleteRelation = deleteRelation;
