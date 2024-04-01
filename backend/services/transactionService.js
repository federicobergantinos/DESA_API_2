const { Account, Transaction, User } = require('../entities/associateModels')
const BadRequest = require('../Errors/BadRequest')
const { isValidAccount } = require('./accountService')
const NotFound = require('../Errors/NotFound')
const { Op } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

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
  let includeOptions = [
    {
      model: Account,
      as: 'account', // Use the 'as' keyword with the alias you defined in the association
      include: [
        {
          model: User,
          as: 'user', // If you also have an alias for the User model, make sure to include it here
          required: true,
        },
      ],
    },
  ]

  const transactions = await Transaction.findAll({
    where: {
      // If you're filtering by accountId, ensure it's done correctly here
      accountId: queryData.accountId,
    },
    include: includeOptions,
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
