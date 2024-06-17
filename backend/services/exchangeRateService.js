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

const getExchangeRateForCurrency = async (currency) => {
  if (currency === 'USD' || currency === 'XCN') {
    return await getExchangeRate('XCN');
  } else if (currency === 'ARS') {
    const rateToARS = await getExchangeRate('ARS');
    const rateToXCN = await getExchangeRate('XCN');
    return { rate: rateToARS.rate * rateToXCN.rate };
  } else {
    throw new NotFound('Unsupported currency');
  }
};

module.exports = {
  getExchangeRate,
  getAllExchangeRates,
  getExchangeRateForCurrency,
};
