const ExchangeRate = require('../entities/exchangeRate');
const NotFound = require('../Errors/NotFound');

const getExchangeRate = async (currency) => {
  const exchangeRate = await ExchangeRate.findOne({ where: { currency } });
  if (!exchangeRate) {
    throw new NotFound('Exchange rate not found');
  }
  return exchangeRate;
};

const getAllExchangeRates = async () => {
  return await ExchangeRate.findAll();
};

module.exports = {
  getExchangeRate,
  getAllExchangeRates,
};
