'use strict';

const Joi = require('joi');

const to = Joi.string().uppercase({ force: true }).required();
const from = Joi.string().uppercase({ force: true }).required();
const amount = Joi.number().required();

const pathParamsQuotation = Joi.object({ to, from, amount });

module.exports = {
  pathParamsQuotation
};
