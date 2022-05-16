'use strict';

const { ExchangerDTO } = require('./dto');
const { ExchangerServices } = require('../services');
const { buildValidationErrorBodyResponse } = require('../utils');

const router = [
  {
    path: '/exchangers',
    method: 'POST',
    options: {
      handler: ExchangerServices.addExchanger,
      description: 'Create a new exchanger provider',
      tags: ['exchanger', 'api'],
      validate: {
        payload: ExchangerDTO.post,
        failAction: (req, reply, err) => {
          const body = buildValidationErrorBodyResponse(err.details);
          return err.isJoi ? reply.response(body).takeover().code(400) : reply.response(err).takeover();
        }
      }
    }
  },
  {
    path: '/exchangers',
    method: 'GET',
    options: {
      handler: ExchangerServices.findAllExchanger,
      description: 'Get all exchangers providers',
      tags: ['exchanger', 'api']
    }
  },
  {
    path: '/exchangers/{id}',
    method: 'GET',
    options: {
      handler: ExchangerServices.findExchangerById,
      description: 'Get an exchanger provider by id',
      tags: ['exchanger', 'api'],
      validate: {
        params: ExchangerDTO.pathParamId,
        failAction: (req, reply, err) => {
          const body = buildValidationErrorBodyResponse(err.details);
          return err.isJoi ? reply.response(body).takeover().code(400) : reply.response(err).takeover();
        }
      }
    }
  },
  {
    path: '/exchangers/{id}',
    method: 'PUT',
    options: {
      handler: ExchangerServices.updateExchanger,
      description: 'Update a exchanger provider by id',
      tags: ['exchanger', 'api'],
      validate: {
        payload: ExchangerDTO.put,
        params: ExchangerDTO.pathParamId,
        failAction: (req, reply, err) => {
          const body = buildValidationErrorBodyResponse(err.details);
          return err.isJoi ? reply.response(body).takeover().code(400) : reply.response(err).takeover();
        }
      }
    }
  },
  {
    path: '/exchangers/{id}',
    method: 'DELETE',
    options: {
      handler: ExchangerServices.deleteExchanger,
      description: 'Delete exchanger provider by id',
      tags: ['exchanger', 'api'],
      validate: {
        params: ExchangerDTO.pathParamId,
        failAction: (req, reply, err) => {
          const body = buildValidationErrorBodyResponse(err.details);
          return err.isJoi ? reply.response(body).takeover().code(400) : reply.response(err).takeover();
        }
      }
    }
  }
];

module.exports = router;
