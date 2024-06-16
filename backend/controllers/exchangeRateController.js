const { getExchangeRate, getAllExchangeRates } = require('../services/exchangeRateService');
const { sendResponse } = require('../configurations/utils.js');

const getRateByCurrency = async (req, res) => {
  try {
    const currency = req.params.currency;
    const exchangeRate = await getExchangeRate(currency);
    return sendResponse(res, 200, exchangeRate);
  } catch (error) {
    console.error(`Error fetching exchange rate: ${error}`);
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An error occurred',
    });
  }
};

const getAllRates = async (req, res) => {
  try {
    const exchangeRates = await getAllExchangeRates();
    return sendResponse(res, 200, exchangeRates);
  } catch (error) {
    console.error(`Error fetching exchange rates: ${error}`);
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An error occurred',
    });
  }
};

module.exports = {
  getRateByCurrency,
  getAllRates,
};
