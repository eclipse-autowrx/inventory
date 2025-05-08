const express = require('express');
const schemaRoute = require('./schema.route');
const relationRoute = require('./relation.route');
const instanceRoute = require('./instance.route');
const instanceRelationRoute = require('./instanceRelation.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/schemas',
    route: schemaRoute,
  },
  {
    path: '/relations',
    route: relationRoute,
  },
  {
    path: '/instances',
    route: instanceRoute,
  },
  {
    path: '/instance-relations',
    route: instanceRelationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
