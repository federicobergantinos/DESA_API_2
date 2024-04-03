const { Account, Transaction, User } = require('../entities/associateModels')
const BadRequest = require('../Errors/BadRequest')
const { isValidAccount } = require('./accountService')
const NotFound = require('../Errors/NotFound')
const { Op } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const createTransaction = async (transactionData) => {
  const { accountId, name, description, amount, currency, status, date } =
    transactionData

  if (!(await isValidAccount(accountId))) {
    throw new BadRequest('Invalid Account')
  }

  try {
    // Iniciar una transacción con sequelize para garantizar atomicidad
    const result = await sequelize.transaction(async (t) => {
      // Crear la transacción
      const newTransaction = await Transaction.create(
        {
          accountId,
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
  const accountId = parseInt(queryData.accountId, 10)
  const limit = queryData.limit || 20 // Establecer un límite predeterminado si no se proporciona en la consulta
  const offset = queryData.offset || 0 // Establecer un offset predeterminado si no se proporciona en la consulta

  let includeOptions = [
    {
      model: Account,
      as: 'account',
      include: [
        {
          model: User,
          as: 'user',
          required: true,
        },
      ],
    },
  ]

  const transactions = await Transaction.findAll({
    where: {
      accountId: accountId,
    },
    include: includeOptions,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
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
