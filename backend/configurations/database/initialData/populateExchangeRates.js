// backend/configurations/database/initialData/populateExchangeRates.js
const { ExchangeRate } = require('../../../entities/associateModels')
const createLogger = require('../../Logger')
const logger = createLogger(__filename)

const populateExchangeRates = async () => {
  const exchangeRatesData = [
    { currency: 'USD', rate: 1 }, // USD to USD
    { currency: 'ARS', rate: 0.01 }, // Ejemplo: 1 ARS = 0.01 USD
    { currency: 'XCN', rate: 1 }, // Ejemplo: 1 XCN = 1 USD
  ]

  try {
    for (const rateData of exchangeRatesData) {
      await ExchangeRate.create(rateData)
    }

    logger.info('Exchange rates have been populated.')
  } catch (error) {
    console.error('Error populating exchange rates:', error)
  }
}

module.exports = populateExchangeRates
