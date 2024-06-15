const { Transaction } = require('../../../entities/associateModels')
const { transactionsData } = require('./transactionsData')
const createLogger = require('../../Logger')
const logger = createLogger(__filename)

const populateTransactions = async () => {
  try {
    for (const transactionData of transactionsData) {
      const {
        name,
        description,
        amount,
        currencyOrigin,
        currencyDestination,
        status,
        date,
        accountNumberDestination,
        accountNumberOrigin,
      } = transactionData

      // Asumimos que accountNumber ya está correctamente establecido en transactionsData
      await Transaction.create({
        name,
        description,
        amount,
        currencyOrigin,
        currencyDestination,
        status,
        date,
        accountNumberDestination,
        accountNumberOrigin,
      })
    }

    logger.info('Transactions table has been populated with initial data.')
  } catch (error) {
    console.error('Error populating Transactions table:', error)
  }
}

module.exports = populateTransactions
