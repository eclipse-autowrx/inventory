const express = require('express');
const validate = require('../../middlewares/validate');
const instanceValidation = require('../../validations/instance.validation');
const instanceController = require('../../controllers/instance.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(instanceValidation.createInstance), instanceController.createInstance)
  .get(validate(instanceValidation.getInstances), instanceController.getInstances);

router
  .route('/:instanceId')
  .get(validate(instanceValidation.getInstance), instanceController.getInstance)
  .patch(validate(instanceValidation.updateInstance), instanceController.updateInstance)
  .delete(validate(instanceValidation.deleteInstance), instanceController.deleteInstance);

module.exports = router;
