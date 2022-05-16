'use strit';

const { Exchanger } = require('../model');
const { getPaginationInfo, checkDulplicates } = require('../utils');

exports.getExchangerById = async (id) => {
  try {
    const exchanger = await Exchanger.findById(id);
    return exchanger;
  } catch (err) {
    console.error({ err });
    throw err;
  }
};

exports.getAllExchangers = async (filter, paginationInfo) => {
  try {
    const all = await Exchanger.paginate(filter, paginationInfo);
    const { docs, totalDocs, totalPages, page, limit } = all;
    return { docs, totalDocs, totalPages, page, limit };
  } catch (err) {
    console.error({ err });
    throw err;
  }
};

exports.addExchanger = async ({ payload }, reply) => {
  try {
    const { name, nickname, address, description } = payload;
    const foreignExchangeRate = payload.foreignExchangeRate.map(({ from, to, feePercentage }) => ({
      pair: `${from}->${to}`,
      feePercentage
    }));
    checkDulplicates(foreignExchangeRate);

    const hasExist = await Exchanger.findOne({ nickname });
    if (hasExist) return reply.response({ message: 'Exchanger already exist' }).code(400);

    const exchanger = new Exchanger({ name, nickname, address, description, foreignExchangeRate });
    await exchanger.save();
    console.debug({ exchanger });
    return reply.response(exchanger).code(201);
  } catch (err) {
    console.error({ err });
    const startsWith = err.message.startsWith('Duplicate values in array pair');
    const message = startsWith ? err.message : 'An unexpected error has occurred, contact system administration';
    return reply.response({ message }).code(startsWith ? 400 : 500);
  }
};

exports.findAllExchanger = async ({ query }, reply) => {
  try {
    console.debug({ query });
    const paginationInfo = getPaginationInfo(query);
    const filter = Object.keys(query).reduce((filter, key) => {
      if (key === 'pair') filter = { foreignExchangeRate: { $elemMatch: { pair: query[key].toUpperCase() } } };
      return filter;
    }, {});

    const all = await this.getAllExchangers(filter, paginationInfo);
    console.debug({ all });
    return reply.response(all).code(200);
  } catch (err) {
    console.error({ err });
    return reply.response({ message: 'An unexpected error has occurred, contact system administration' }).code(500);
  }
};

exports.findExchangerById = async ({ params }, reply) => {
  try {
    const { id } = params;
    const exchanger = await this.getExchangerById(id);
    if (!exchanger) return reply.response({ message: 'Exchanger not fount' }).code(404);

    return reply.response(exchanger).code(200);
  } catch (err) {
    console.error({ err });
    return reply.response({ message: 'An unexpected error has occurred, contact system administration' }).code(500);
  }
};

exports.updateExchanger = async ({ params, payload }, reply) => {
  try {
    const { id } = params;
    const { name, address, description } = payload;
    const foreignExchangeRate = payload.foreignExchangeRate.map(({ from, to, feePercentage }) => ({
      pair: `${from}->${to}`,
      feePercentage
    }));
    checkDulplicates(foreignExchangeRate);

    const exchanger = await Exchanger.findByIdAndUpdate(id, { name, address, description, foreignExchangeRate }, { new: true });
    console.debug({ exchanger });

    if (!exchanger) return reply.response({ message: 'Exchanger not fount' }).code(404);

    return reply.response(exchanger).code(200);
  } catch (err) {
    console.error({ err });
    const startsWith = err.message.startsWith('Duplicate values in array pair');
    const message = startsWith ? err.message : 'An unexpected error has occurred, contact system administration';
    return reply.response({ message }).code(startsWith ? 400 : 500);
  }
};

exports.deleteExchanger = async ({ params }, reply) => {
  try {
    const { id } = params;
    const exchanger = await Exchanger.findByIdAndRemove(id);
    if (!exchanger) return reply.response({ message: 'Exchanger not fount' }).code(404);

    return reply.response(exchanger).code(200);
  } catch (err) {
    console.error({ err });
    return reply.response({ message: 'An unexpected error has occurred, contact system administration' }).code(500);
  }
};
