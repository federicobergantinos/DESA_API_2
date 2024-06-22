const { Transaction } = require('../entities/associateModels')
const { findAccountByAccountNumber } = require('./accountService')
const NotFound = require('../Errors/NotFound')
const { Op } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const createTransaction = async (transactionData) => {
  const account = await findAccountByAccountNumber(
    transactionData.accountNumberDestination
  )

  if (account === null) {
    throw new Error('Invalid Account')
  }

  const userName = account.user
    ? `${account.user.name} ${account.user.surname}`.trim()
    : 'Transferencia'
  const transactionName = userName || 'Transferencia'

  try {
    // Iniciar una transacción con sequelize para garantizar atomicidad
    const result = await sequelize.transaction(async (t) => {
      // Crear la transacción
      const newTransaction = await Transaction.create(
        {
          name: transactionName,
          description: transactionData.description,
          amountOrigin: transactionData.amountOrigin,
          amountDestination: transactionData.amountDestination,
          accountNumberOrigin: transactionData.accountNumberOrigin,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyDestination,
          accountNumberDestination: transactionData.accountNumberDestination,
          status: transactionData.status,
          date: transactionData.date,
          transactionId: transactionData.transactionId,
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
  const accountNumberOrigin = queryData.accountNumberOrigin
  const limit = queryData.limit || 20 // Establecer un límite predeterminado si no se proporciona en la consulta
  const offset = queryData.offset || 0 // Establecer un offset predeterminado si no se proporciona en la consulta

  const transactions = await Transaction.findAll({
    where: { accountNumberOrigin: accountNumberOrigin },
    attributes: [
      'id',
      'name',
      'description',
      'amountOrigin',
      'amountDestination',
      'currencyOrigin',
      'currencyDestination',
      'accountNumberOrigin',
      'accountNumberDestination',
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

const updateTransactionStatus = async (transactionId, status) => {
  try {
    const transaction = await Transaction.findOne({ where: { transactionId } })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    transaction.status = status
    await transaction.save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransactionStatus,
}
