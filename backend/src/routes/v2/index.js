const express = require('express');
const schemaRoute = require('./schema.route');
const relationRoute = require('./relation.route');
const instanceRoute = require('./instance.route');
const instanceRelationRoute = require('./instanceRelation.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/inventory/schemas',
    route: schemaRoute,
  },
  {
    path: '/inventory/relations',
    route: relationRoute,
  },
  {
    path: '/inventory/instances',
    route: instanceRoute,
  },
  {
    path: '/inventory/instance-relations',
    route: instanceRelationRoute,
  },
];

const devRoutes = [
  {
    path: '/inventory/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
