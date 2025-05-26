const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const schemaValidation = require('../../validations/schema.validation');
const schemaController = require('../../controllers/schema.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(schemaValidation.createSchema), schemaController.createSchema)
  .get(validate(schemaValidation.getSchemas), schemaController.getSchemas);

router
  .route('/:schemaId')
  .get(validate(schemaValidation.getSchema), schemaController.getSchema)
  .patch(auth(), validate(schemaValidation.updateSchema), schemaController.updateSchema)
  .delete(auth(), validate(schemaValidation.deleteSchema), schemaController.deleteSchema);

/**
 * @swagger
 * tags:
 *  name: Schemas
 *  description: API for managing schemas
 *
 * @swagger
 * paths:
 *   /schemas:
 *     post:
 *       summary: Create a new schema
 *       tags: [Schemas]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - schema_definition
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the schema
 *                 description:
 *                   type: string
 *                   description: Optional description of the schema
 *                 schema_definition:
 *                   type: string
 *                   description: Definition of the schema
 *
 *               example:
 *                 name: "UserProfile"
 *                 description: "Schema for user profiles"
 *                 schema_definition: "{\"title\":\"Person\",\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\",\"description\":\"The person's first name.\"},\"age\":{\"description\":\"Age in years which must be equal to or greater than zero.\",\"type\":\"integer\",\"minimum\":0}}}"
 *       responses:
 *         201:
 *           description: Schema created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Schema'
 *         400:
 *           $ref: '#/components/responses/BadRequest'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *     get:
 *       summary: Get all schemas
 *       tags: [Schemas]
 *       parameters:
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: Filter by schema name
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: Page number for pagination
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             minimum: 1
 *             maximum: 100
 *           description: Number of schemas per page
 *       responses:
 *         200:
 *           description: List of schemas
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   results:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Schema'
 *                   page:
 *                     type: integer
 *                   limit:
 *                     type: integer
 *                   totalPages:
 *                     type: integer
 *                   totalResults:
 *                     type: integer
 *         400:
 *           description: Invalid query parameters
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *   /schemas/{schemaId}:
 *     get:
 *       summary: Get a schema by ID
 *       tags: [Schemas]
 *       parameters:
 *         - in: path
 *           name: schemaId
 *           required: true
 *           schema:
 *             type: string
 *             format: objectId
 *           description: ID of the schema to retrieve
 *       responses:
 *         200:
 *           description: Schema details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Schema'
 *         400:
 *           description: Invalid schema ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         404:
 *           description: Schema not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *     patch:
 *       summary: Update a schema
 *       tags: [Schemas]
 *       parameters:
 *         - in: path
 *           name: schemaId
 *           required: true
 *           schema:
 *             type: string
 *             format: objectId
 *           description: ID of the schema to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Updated name of the schema
 *                 description:
 *                   type: string
 *                   description: Updated description of the schema
 *                 schema_definition:
 *                   type: string
 *                   description: Updated schema definition
 *               example:
 *                 name: "UpdatedUserProfile"
 *                 description: "Updated schema for user profiles"
 *                 schema_definition: "{ 'name': { 'type': 'string' }, 'age': { 'type': 'number' } }"
 *       responses:
 *         200:
 *           description: Schema updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Schema'
 *         400:
 *           description: Invalid input or schema ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         404:
 *           description: Schema not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *     delete:
 *       summary: Delete a schema
 *       tags: [Schemas]
 *       parameters:
 *         - in: path
 *           name: schemaId
 *           required: true
 *           schema:
 *             type: string
 *             format: objectId
 *           description: ID of the schema to delete
 *       responses:
 *         204:
 *           description: Schema deleted successfully
 *         400:
 *           description: Invalid schema ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         404:
 *           description: Schema not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */

module.exports = router;
