'use strict';

const buildValidationErrorBodyResponse = (errors) => {
  return errors.reduce((obj, { message, context: { key } }) => {
    obj[key] = message.replace(/\"/g, `'`);
    return obj;
  }, {});
};

const getEnv = (name) => {
  if (isEmpty(process.env[name])) {
    const err = new Error();
    err.code = 'ENVIRONMENT_VARIABLES_ERROR';
    err.message = `the environment variable ${name} does not exist`;
    throw err;
    process.exit(1);
  }

  return process.env[name];
};

const isEmpty = (value) => {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
};

const getPaginationInfo = (query) => {
  const { limit = getEnv('PAGINATOR_LIMIT'), page = getEnv('PAGINATOR_PAGE') } = query;
  return { limit, page };
};

const isErrorObj = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Error]';
};

const CURRENCIES = new Array(...getEnv('CURRENCIES').split(','));

const checkDulplicates = (foreignExchangeRate) => {
  const existingPairs = [];
  for (const { pair } of foreignExchangeRate) {
    console.debug(existingPairs.some((p) => p == pair));
    if (existingPairs.some((p) => p == pair)) throw new Error(`Duplicate values in array pair: ${JSON.stringify(foreignExchangeRate).replace(/"/g, `'`)}`);
    existingPairs.push(pair);
  }
};

module.exports = {
  buildValidationErrorBodyResponse,
  getPaginationInfo,
  checkDulplicates,
  isErrorObj,
  CURRENCIES,
  isEmpty,
  getEnv
};
