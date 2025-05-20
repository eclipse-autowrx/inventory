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

const devRoutes = [
  {
    path: '/docs',
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
