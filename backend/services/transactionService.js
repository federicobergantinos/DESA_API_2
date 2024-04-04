const { Account, Transaction, User } = require('../entities/associateModels')
const BadRequest = require('../Errors/BadRequest')
const { isValidAccount } = require('./accountService')
const NotFound = require('../Errors/NotFound')
const { Op } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const createTransaction = async (transactionData) => {
  const { accountNumber, name, description, amount, currency, status, date } =
    transactionData

  if (!(await isValidAccount(accountNumber))) {
    throw new BadRequest('Invalid Account')
  }

  try {
    // Iniciar una transacción con sequelize para garantizar atomicidad
    const result = await sequelize.transaction(async (t) => {
      // Crear la transacción
      const newTransaction = await Transaction.create(
        {
          accountNumber,
          name,
          description,
          amount,
          currency,
          status,
          date,
        },
        { transaction: t }
      )

      return newTransaction
    })

    return result
  } catch (error) {
    throw error
  }
}

const getTransactions = async (queryData) => {
  const accountNumber = queryData.accountNumber.toString()
  const limit = queryData.limit || 20 // Establecer un límite predeterminado si no se proporciona en la consulta
  const offset = queryData.offset || 0 // Establecer un offset predeterminado si no se proporciona en la consulta

  const transactions = await Transaction.findAll({
    where: { accountNumber: accountNumber },
    attributes: [
      'id',
      'name',
      'description',
      'amount',
      'currency',
      'accountNumber',
      'date',
    ],
    limit,
    offset,
    order: [['date', 'DESC']],
  })

  return transactions
}

const getTransaction = async (transactionId) => {
  const transaction = await Transaction.findByPk(transactionId)
  if (transaction === null) {
    throw new NotFound('Transaction not found')
  }

  return transaction
}
module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
}
