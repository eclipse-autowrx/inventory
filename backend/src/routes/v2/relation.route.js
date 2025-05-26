const express = require('express');
const validate = require('../../middlewares/validate');
const relationValidation = require('../../validations/relation.validation');
const relationController = require('../../controllers/relation.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(relationValidation.createRelation), relationController.createRelation)
  .get(validate(relationValidation.getRelations), relationController.getRelations);

router
  .route('/:relationId')
  .get(validate(relationValidation.getRelation), relationController.getRelation)
  .patch(validate(relationValidation.updateRelation), relationController.updateRelation)
  .delete(validate(relationValidation.deleteRelation), relationController.deleteRelation);

module.exports = router;
