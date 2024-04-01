const { Transaction } = require('../../../entities/associateModels')
const { transactionsData } = require('./transactionsData')

const populateTransactions = async () => {
  try {
    for (const transactionData of transactionsData) {
      const { name, description, amount, currency, status, date, accountId } =
        transactionData

      // Asumimos que accountId ya está correctamente establecido en transactionsData
      await Transaction.create({
        name,
        description,
        amount,
        currency,
        status,
        date,
        accountId, // Asegúrate de que este campo exista en tu modelo y data
      })
    }

    console.log('Transactions table has been populated with initial data.')
  } catch (error) {
    console.error('Error populating Transactions table:', error)
  }
}

module.exports = populateTransactions
