const express = require('express');
const validate = require('../../middlewares/validate');
const instanceRelationValidation = require('../../validations/instanceRelation.validation');
const instanceRelationController = require('../../controllers/instanceRelation.controller');

const router = express.Router();

// Use kebab-case for route names generally
router
  .route('/')
  .post(validate(instanceRelationValidation.createInstanceRelation), instanceRelationController.createInstanceRelation)
  .get(validate(instanceRelationValidation.getInstanceRelations), instanceRelationController.getInstanceRelations);

router
  .route('/:instanceRelationId')
  .get(validate(instanceRelationValidation.getInstanceRelation), instanceRelationController.getInstanceRelation)
  .patch(validate(instanceRelationValidation.updateInstanceRelation), instanceRelationController.updateInstanceRelation)
  .delete(validate(instanceRelationValidation.deleteInstanceRelation), instanceRelationController.deleteInstanceRelation);

module.exports = router;
