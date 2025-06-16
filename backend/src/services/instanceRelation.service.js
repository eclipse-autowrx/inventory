const httpStatus = require('http-status');
const { InstanceRelation, Relation, Instance } = require('../models');
const ApiError = require('../utils/ApiError');
const ParsedJsonPropertiesMongooseDecorator = require('../decorators/ParsedJsonPropertiesMongooseDecorator');
const InterservicePopulateListDecorator = require('../decorators/InterservicePopulateDecorator');

/**
 * Validate the compatibility of source/target instances with the relation definition
 * @param {ObjectId} relationId
 * @param {ObjectId} sourceInstanceId
 * @param {ObjectId} targetInstanceId
 */
const validateRelationCompatibility = async (relation, sourceInstance, targetInstance) => {
  // Check if source instance's schema matches relation's source schema
  if (sourceInstance.schema._id.toString() !== relation.source._id.toString()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Source instance's schema (${sourceInstance.schema}) does not match relation's defined source schema (${relation.source})`,
    );
  }

  // Check if target instance's schema matches relation's target schema
  if (targetInstance.schema._id.toString() !== relation.target._id.toString()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Target instance's schema (${targetInstance.schema}) does not match relation's defined target schema (${relation.target})`,
    );
  }

  return true;
};

/**
 * Create an instance relation
 * @param {Object} body
 * @param {string} userId
 * @returns {Promise<InstanceRelation>}
 */
const createInstanceRelation = async (body, userId) => {
  const { relation: relationId, source: sourceInstanceId, target: targetInstanceId } = body;

  const [relation, sourceInstance, targetInstance] = await Promise.all([
    Relation.findById(relationId).populate('source', 'name').populate('target', 'name'),
    Instance.findById(sourceInstanceId).populate('schema', 'name'),
    Instance.findById(targetInstanceId).populate('schema', 'name'),
  ]);

  if (!relation) throw new ApiError(httpStatus.BAD_REQUEST, `Relation with id ${relationId} not found.`);
  if (!sourceInstance) throw new ApiError(httpStatus.BAD_REQUEST, `Source instance with id ${sourceInstanceId} not found.`);
  if (!targetInstance) throw new ApiError(httpStatus.BAD_REQUEST, `Target instance with id ${targetInstanceId} not found.`);

  // Validate compatibility
  await validateRelationCompatibility(relation, sourceInstance, targetInstance);

  // Validate exact existing instance relation
  const existingInstanceRelations = await InstanceRelation.find({
    relation: relationId,
  });
  if (
    existingInstanceRelations.some(
      (ir) => String(ir.source) === String(sourceInstanceId) && String(ir.target) === String(targetInstanceId),
    )
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This exact relation between these instances already exists.');
  }

  // Validate source and target cardinality
  const { source_cardinality: sourceCardinality, target_cardinality: targetCardinality } = relation;
  const singleCardinalityTypes = ['one-to-one', 'zero-to-one'];

  if (
    singleCardinalityTypes.includes(sourceCardinality) &&
    existingInstanceRelations.some((ir) => String(ir.target) === String(targetInstanceId))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot create this instance relation: violates source cardinality (${sourceCardinality}).`,
    );
  }

  if (
    singleCardinalityTypes.includes(targetCardinality) &&
    existingInstanceRelations.some((ir) => String(ir.source) === String(sourceInstanceId))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot create this instance relation: violates target cardinality (${targetCardinality}).`,
    );
  }

  // Create the instance relation
  const instanceRelation = await InstanceRelation.create({
    ...body,
    created_by: userId,
  });
  return instanceRelation;
};

/**
 * Query for instance relations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryInstanceRelations = async (filter, options) => {
  const finalOptions = { ...options };
  // Populate fields for context
  if (!finalOptions.populate) {
    // Need wrapping array because of spread operator in paginate.plugin logic
    finalOptions.populate = [
      [
        { path: 'relation', select: 'type source target' },
        { path: 'source', select: 'schema name' },
        { path: 'target', select: 'schema name' },
      ],
    ];
  }
  const instanceRelations = await InstanceRelation.paginate(filter, finalOptions);
  instanceRelations.results = await new InterservicePopulateListDecorator(instanceRelations.results)
    .populate('created_by')
    .getPopulatedDocs();
  return instanceRelations;
};

/**
 * Get instance relation by id
 * @param {ObjectId} id
 * @returns {Promise<InstanceRelation>}
 */
const getInstanceRelationById = async (id) => {
  const instanceRelation = await InstanceRelation.findById(id).populate('relation').populate('source').populate('target');
  if (!instanceRelation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instance relation not found');
  }
  return new InterservicePopulateListDecorator(
    new ParsedJsonPropertiesMongooseDecorator(instanceRelation, 'source.data', 'target.data').getParsedPropertiesData(),
  )
    .populate('created_by')
    .getSinglePopulatedDoc();
};

/**
 *
 * @param {string} instanceRelationId
 * @param {string} userId
 * @returns
 */
const isOwner = async (instanceRelationId, userId) => {
  const instanceRelation = await getInstanceRelationById(instanceRelationId);
  return String(instanceRelation.created_by?.id) === String(userId);
};

/**
 * Update instance relation by id (typically only metadata)
 * @param {ObjectId} instanceRelationId
 * @param {Object} updateBody
 * @returns {Promise<InstanceRelation>}
 */
const updateInstanceRelationById = async (instanceRelationId, updateBody) => {
  const instanceRelation = await getInstanceRelationById(instanceRelationId);

  Object.assign(instanceRelation, updateBody);
  await instanceRelation.save();
  return instanceRelation;
};

/**
 * Delete instance relation by id
 * @param {ObjectId} instanceRelationId
 * @returns {Promise<InstanceRelation>}
 */
const deleteInstanceRelationById = async (instanceRelationId) => {
  const instanceRelation = await getInstanceRelationById(instanceRelationId);
  await instanceRelation.remove();
  return instanceRelation;
};

module.exports.createInstanceRelation = createInstanceRelation;
module.exports.queryInstanceRelations = queryInstanceRelations;
module.exports.getInstanceRelationById = getInstanceRelationById;
module.exports.updateInstanceRelationById = updateInstanceRelationById;
module.exports.deleteInstanceRelationById = deleteInstanceRelationById;
module.exports.isOwner = isOwner;
