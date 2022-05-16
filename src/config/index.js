'use strict';

const SwaggerConfig = require('./swagger.config');
const MongoDB = require('./mongodb.config');

const RouterConfig = {
  routes: {
    prefix: '/api'
  }
};

module.exports = {
  SwaggerConfig,
  RouterConfig,
  MongoDB
};
