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
        currency,
        status,
        date,
        accountNumber,
      } = transactionData

      // Asumimos que accountNumber ya está correctamente establecido en transactionsData
      await Transaction.create({
        name,
        description,
        amount,
        currency,
        status,
        date,
        accountNumber, // Asegúrate de que este campo exista en tu modelo y data
      })
    }

    logger.info('Transactions table has been populated with initial data.')
  } catch (error) {
    console.error('Error populating Transactions table:', error)
  }
}

module.exports = populateTransactions
