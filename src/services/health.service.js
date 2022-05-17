'use strict';

const { Cache } = require('../model');

exports.health = async (req, reply) => {
  const { cache = false } = req.query;
  if (cache) {
    try {
      let hasCache = await Cache.findOne({ key: 'USD->ARS' });
      if (!hasCache) {
        const cache = new Cache({ key: 'USD->ARS', rate: 200 });
        await cache.save();
      }

      hasCache = await Cache.findOne({ key: 'ARS->USD' });
      if (!hasCache) {
        const cache = new Cache({ key: 'ARS->USD', rate: 0.004879 });
        await cache.save();
      }
    } catch (err) {
      console.error({ err });
      return reply.response({ message: 'An unexpected error has occurred, contact system administration' }).code(500);
    }
  }
  return reply.response({ status: 'ok' }).code(200);
};
