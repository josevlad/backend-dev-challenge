'use strit';

const axios = require('axios');

const { Cache } = require('../model');
const { getExchangerById, getAllExchangers } = require('./exchanger.service');
const { getPaginationInfo, getEnv } = require('../utils');

const getApiResponse = async ({ from, to, amount }) => {
  const key = `${from}->${to}`;
  const responseCache = await Cache.findOne({ key });
  if (responseCache) {
    const { rate } = responseCache;
    const result = amount * rate;
    console.debug({ rate, result });
    return { rate, result };
  }

  const { data } = await axios.get(getEnv('FIXER_URL'), { params: { from, to, amount, access_key: getEnv('FIXER_API_KEY') } });
  console.debug({ data });
  if (!data.success) throw new Error(`FIXER_API_ERROR: code '${data.error.code}', info '${data.error.info}'`);

  const {
    info: { rate },
    result
  } = data;

  const cache = new Cache({ key, rate });
  await cache.save();
  console.debug({ rate, result });
  return { rate, result };
};

exports.findAllQuotations = async ({ query, params }, reply) => {
  try {
    let all;
    const { exchangerId } = query;
    const { from, to, amount } = params;
    const { rate, result } = await getApiResponse({ from, to, amount });

    if (exchangerId) {
      const docs = await getExchangerById(exchangerId);
      all = { docs: docs ? [docs] : [], totalDocs: docs ? 1 : 0, totalPages: 1, page: +getEnv('PAGINATOR_PAGE'), limit: +getEnv('PAGINATOR_LIMIT') };
    } else {
      const paginationInfo = getPaginationInfo(query);
      const filter = { foreignExchangeRate: { $elemMatch: { pair: `${from}->${to}` } } };
      all = await getAllExchangers(filter, paginationInfo);
    }

    const fxRateExchanger = all.docs.reduce((arr, exchanger) => {
      const fxRate = exchanger.foreignExchangeRate.find((fxr) => fxr.pair === `${from}->${to}`);
      if (fxRate)
        arr.push({
          exchangerId: exchanger.id,
          name: exchanger.name,
          feePercentage: fxRate.feePercentage
        });
      return arr;
    }, []);

    const docs = fxRateExchanger.map((exchanger) => {
      const { feePercentage, name, exchangerId } = exchanger;
      const pair = `${from}->${to}`;
      const exchangerName = name;
      const originalRateAmount = result.toLocaleString('en-US', { style: 'currency', currency: to });
      const exchangerFeePercentage = `${feePercentage}%`;
      const exchangerFeeAmount = (feePercentage * result) / 100;
      const deliveryRateAmount = result - exchangerFeeAmount;

      return {
        exchangerId,
        exchangerName,
        pair,
        rate: rate.toLocaleString('en-US', { style: 'currency', currency: from }),
        originalRateAmount,
        exchangerFeePercentage,
        exchangerFeeAmount: exchangerFeeAmount.toLocaleString('en-US', { style: 'currency', currency: to }),
        deliveryRateAmount: deliveryRateAmount.toLocaleString('en-US', { style: 'currency', currency: to })
      };
    });

    console.debug({ all });
    const { totalDocs, totalPages, page, limit } = all;
    return reply.response({ docs, totalDocs, totalPages, page, limit }).code(200);
  } catch (err) {
    console.error({ err: err.message });
    return reply.response({ message: 'An unexpected error has occurred, contact system administration' }).code(500);
  }
};
