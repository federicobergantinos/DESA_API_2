const ExchangeRate = require('../entities/exchangeRate')
const NotFound = require('../Errors/NotFound')

const getExchangeRate = async (currency) => {
  const exchangeRate = await ExchangeRate.findOne({ where: { currency } })
  if (!exchangeRate) {
    throw new NotFound('Exchange rate not found')
  }
  return exchangeRate
}

const getAllExchangeRates = async () => {
  return await ExchangeRate.findAll()
}

const getExchangeRateForCurrency = async (currency) => {
  if (currency === 'USD' || currency === 'XCN') {
    const rateXCN = await getExchangeRate('XCN')
    return {
      XCN: rateXCN.rate,
    }
  } else if (currency === 'ARS') {
    const rateARS = await getExchangeRate('ARS')
    const rateXCN = await getExchangeRate('XCN')
    return {
      ARS: rateARS.rate,
      XCN: rateXCN.rate,
    }
  } else {
    throw new NotFound('Unsupported currency')
  }
}

module.exports = {
  getExchangeRate,
  getAllExchangeRates,
  getExchangeRateForCurrency,
}
