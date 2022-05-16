'use strict';

const { Cache } = require('../model');

exports.health = async (req, reply) => {
  console.debug({ req });
  const { cache = false } = req.query;
  if (cache) {
    try {
      const cache = new Cache({ key: 'USD->ARS', rate: 200 });
      await cache.save();
    } catch (err) {
      console.error({ err });
      return reply.response({ message: 'An unexpected error has occurred, contact system administration' }).code(500);
    }
  }
  return reply.response({ status: 'ok' }).code(200);
};
