'use strict';

const Pack = require('./../../package');
const HapiSwagger = require('hapi-swagger');

const swaggerOptions = {
  info: {
    title: 'backend-dev-challenge api-doc',
    version: Pack.version
  },
  documentationPath: '/api/docs',
  grouping: 'tags',
  schemes: ['http', 'https']
};

module.exports = {
  plugin: HapiSwagger,
  options: swaggerOptions
};
