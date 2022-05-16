'use strict';

const Hapi = require('@hapi/hapi');
const { getEnv } = require('./utils');

const server = Hapi.server({
  port: getEnv('PORT'),
  host: getEnv('HOST'),
  routes: {
    cors: {
      maxAge: 60,
      origin: ['*'], // an array of origins or 'ignore'
      credentials: true, // boolean - 'Access-Control-Allow-Credentials'
      additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
      exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'], // an array of exposed headers - 'Access-Control-Expose-Headers',
      headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'] // an array of strings - 'Access-Control-Allow-Headers'
    }
  }
});

module.exports = server;
