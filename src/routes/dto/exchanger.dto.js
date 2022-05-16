'use strict';

const Joi = require('joi');
const { CURRENCIES } = require('../../utils');

const fxRate = Joi.object({
  from: Joi.string()
    .valid(...CURRENCIES)
    .required(),
  to: Joi.array()
    .items(Joi.string().valid(...CURRENCIES))
    .single()
    .invalid(Joi.ref('from'))
    .required()
    .messages({
      'any.invalid': `{#label} should not be equal to field 'from'`,
      'any.only': '{#label} must be {if(#valids.length == 1, "", "one of ")}{#valids}'
    }),
  feePercentage: Joi.number().required()
}).options({ abortEarly: false });

const name = Joi.string().required();
const nickname = Joi.string().required();
const address = Joi.string().required();
const description = Joi.string().required();
const foreignExchangeRate = Joi.array().items(fxRate);

const pathParamId = Joi.object({ id: Joi.number().required() });
const post = Joi.object({ name, nickname, address, description, foreignExchangeRate }).options({ abortEarly: false });
const put = Joi.object({ name, address, description, foreignExchangeRate }).options({ abortEarly: false });

module.exports = {
  put,
  post,
  fxRate,
  pathParamId
};
