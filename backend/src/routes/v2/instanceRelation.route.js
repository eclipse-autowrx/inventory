const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const instanceRelationValidation = require('../../validations/instanceRelation.validation');
const instanceRelationController = require('../../controllers/instanceRelation.controller');

const router = express.Router();

// Use kebab-case for route names generally
router
  .route('/')
  .post(
    auth(),
    validate(instanceRelationValidation.createInstanceRelation),
    instanceRelationController.createInstanceRelation
  )
  .get(validate(instanceRelationValidation.getInstanceRelations), instanceRelationController.getInstanceRelations);

router
  .route('/:instanceRelationId')
  .get(validate(instanceRelationValidation.getInstanceRelation), instanceRelationController.getInstanceRelation)
  .patch(
    auth(),
    validate(instanceRelationValidation.updateInstanceRelation),
    instanceRelationController.updateInstanceRelation
  )
  .delete(
    auth(),
    validate(instanceRelationValidation.deleteInstanceRelation),
    instanceRelationController.deleteInstanceRelation
  );

module.exports = router;
