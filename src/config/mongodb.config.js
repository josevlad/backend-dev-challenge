'use strict';

const mongoose = require('mongoose');
const { getEnv } = require('../utils');

const CONNECTION_CONFIG = Object.freeze({
  authSource: 'admin',
  user: getEnv('MONGODB_USER'),
  pass: getEnv('MONGODB_PASSWORD'),
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = {
  connect: async () => {
    try {
      mongoose.set('debug', getEnv('MONGOOSE_DEBUG'));
      const URL = getEnv('MONGODB_URL');
      mongoose.connect(URL, CONNECTION_CONFIG);
      console.debug('successful database connection');
    } catch (err) {
      console.error({ err });
      process.exit(1);
    }
  }
};
