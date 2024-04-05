const {
  createTransaction,
  getTransactions,
  getTransaction,
} = require('../services/transactionService')
const { sendResponse } = require('../configurations/utils.js')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const create = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
    }
    const transactionId = await createTransaction(transactionData)

    return sendResponse(res, 201, {
      id: transactionId,
      message: 'Transaccion creada con éxito',
    })
  } catch (error) {
    logger.error(`Error en la creación de la transaccion: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'Ha ocurrido una excepción',
    })
  }
}

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 0 // Asegúrate de proporcionar un valor por defecto
  const limit = parseInt(req.query.limit) || 20 // Límite de ítems por página
  const offset = page * limit
  const accountNumber = req.query.accountNumber

  try {
    const response = await getTransactions({ limit, offset, accountNumber })

    return sendResponse(res, 200, response)
  } catch (error) {
    logger.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getById = async (req, res) => {
  try {
    const transactionId = req.params.transactionId
    const response = await getTransaction(transactionId)
    const transaction = response.dataValues

    return sendResponse(res, 200, {
      ...transaction,
    })
  } catch (error) {
    logger.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const calculateAccountBalance = async (req, res) => {
  try {
    const accountNumber = req.query.accountNumber
    const page = parseInt(req.query.page) || 0 // Asegúrate de proporcionar un valor por defecto
    const limit = parseInt(req.query.limit) || 20 // Límite de ítems por página
    const offset = page * limit

    const transactions = await getTransactions({ accountNumber, limit, offset })

    let balance = 0
    transactions.forEach((transaction) => {
      balance += transaction.amount
    })

    return sendResponse(res, 200, balance)
  } catch (error) {
    logger.error('Error calculando el saldo de la cuenta:', error)
    throw error
  }
}

module.exports = {
  create,
  getAll,
  getById,
  calculateAccountBalance,
}
