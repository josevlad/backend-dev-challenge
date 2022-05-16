'use strict';

const { HealthServices } = require('../services');

const router = [
  {
    path: '/health',
    method: 'GET',
    options: {
      handler: HealthServices.health,
      description: 'Service get health',
      tags: ['api', 'health']
    }
  }
];

module.exports = router;
