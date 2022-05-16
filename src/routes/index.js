'use strict';

const healthRoute = require('./health.route');
const exchangerRoute = require('./exchanger.route');
const quotationRoute = require('./quotation.route');

module.exports = {
  name: 'routes',
  version: '1.0.0',
  register: (server) => {
    server.route(healthRoute);
    server.route(exchangerRoute);
    server.route(quotationRoute);
  }
};
