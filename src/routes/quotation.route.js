'use strict';

const { QuotationDTO } = require('./dto');
const { QuotationsServices } = require('../services');
const { buildValidationErrorBodyResponse } = require('../utils');

const router = [
  {
    path: '/quotations/from/{from}/to/{to}/amount/{amount}',
    method: 'GET',
    options: {
      handler: QuotationsServices.findAllQuotations,
      description: 'Get quotations',
      tags: ['quotation', 'api'],
      validate: {
        params: QuotationDTO.pathParamsQuotation,
        failAction: (req, reply, err) => {
          const body = buildValidationErrorBodyResponse(err.details);
          return err.isJoi ? reply.response(body).takeover().code(400) : reply.response(err).takeover();
        }
      }
    }
  }
];

module.exports = router;
