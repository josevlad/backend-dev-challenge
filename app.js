'use strict';

require('dotenv').config();
require('overwrite-system-logs').overwriteSystemLogs();

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const server = require('./src/server');
const routers = require('./src/routes');
const { SwaggerConfig, RouterConfig, MongoDB } = require('./src/config');

const init = async () => {
  try {
    await server.register([Inert, Vision, SwaggerConfig]);
    await server.register(routers, RouterConfig);
    await MongoDB.connect();

    server.events.on('response', (req) => {
      const {
        path,
        method,
        info: { remoteAddress },
        response: { statusCode },
        server: {
          info: { port }
        }
      } = req;
      console.debug(`${remoteAddress}:${port} ${method.toUpperCase()} ${path} --> ${statusCode}`);
    });

    await server.start();
    console.debug(`Server running on ${server.info.uri}`);
  } catch (err) {
    console.log({ err });
    process.exit(1);
  }
};

init();

process.on('unhandledRejection', (err) => {
  console.log({ err });
  process.exit(1);
});

module.exports = server;
