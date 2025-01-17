const {
  createTransaction,
  getTransactions,
  getTransaction,
} = require('../services/transactionService')
const { sendResponse } = require('../configurations/utils.js')
const createLogger = require('../configurations/Logger')
const { sendMessageToSNS } = require('../utils/snsSender')
const { v4: uuidv4 } = require('uuid')
const logger = createLogger(__filename)

const create = async (req, res) => {
  try {
    const transactionId = uuidv4() // Generar un UUID para ambas transacciones

    const transactionData = {
      ...req.body,
      transactionId,
    }

    // Crear la transacción para el remitente (negativa)
    const transactionOrigin = {
      ...transactionData,
      amountOrigin: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
      amountDestination: -Math.abs(transactionData.amountDestination), // Asegurar que el monto es negativo
      typeTransaction: req.body.typeTransaction,
    }
    await createTransaction(transactionOrigin)

    // Crear la transacción para el receptor (positiva)
    const transactionDestination = {
      ...transactionData,
      accountNumberOrigin: transactionData.accountNumberDestination,
      accountNumberDestination: transactionData.accountNumberOrigin,
      currencyOrigin: transactionData.currencyDestination,
      currencyDestination: transactionData.currencyOrigin,
      amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
      amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
      typeTransaction: req.body.typeTransaction,
    }
    await createTransaction(transactionDestination)

    // Determinar el operationType según el typeTransaction
    let operationType
    switch (transactionData.typeTransaction) {
      case 'BuyXCN':
        operationType = 'CreateBuyXCN'
        break
      case 'SellXCN':
        operationType = 'CreateSellXCN'
        break
      case 'Transfer':
      default:
        operationType = 'CreateTransferXCN'
        break
    }

    // Crear el payload para SNS solo para la transacción original
    if (
      transactionData.currencyOrigin === 'XCoin' ||
      transactionData.currencyDestination === 'XCoin'
    ) {
      const payload = {
        operationType: operationType,
        data: {
          accountNumberOrigin: transactionData.accountNumberOrigin,
          accountNumberDestination: transactionData.accountNumberDestination,
          transactionId: transactionData.transactionId,
          name: transactionData.name,
          description: transactionData.description,
          amountOrigin: transactionData.amountOrigin,
          amountDestination: transactionData.amountDestination,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyDestination,
          status: transactionData.status,
          date: transactionData.date,
        },
      }
      // Enviar mensaje a SNS
      await sendMessageToSNS(payload)
    }

    return sendResponse(res, 201, {
      id: transactionId,
      message: 'Transacción creada con éxito',
    })
  } catch (error) {
    console.error(`Error en la creación de la transacción: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'Ha ocurrido una excepción',
    })
  }
}

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 0 // Asegúrate de proporcionar un valor por defecto
  const limit = parseInt(req.query.limit) || 20 // Límite de ítems por página
  const offset = page * limit
  const accountNumberOrigin = req.query.accountNumber

  try {
    const response = await getTransactions({
      limit,
      offset,
      accountNumberOrigin,
    })

    return sendResponse(res, 200, response)
  } catch (error) {
    console.error(` ${error}`)
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
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const calculateAccountBalance = async (req, res) => {
  try {
    const accountNumberOrigin = req.query.accountNumber
    const page = parseInt(req.query.page) || 0 // Asegúrate de proporcionar un valor por defecto
    const limit = parseInt(req.query.limit) || 20 // Límite de ítems por página
    const offset = page * limit

    const transactions = await getTransactions({
      accountNumberOrigin,
      limit,
      offset,
    })

    let balance = 0
    transactions.forEach((transaction) => {
      balance += transaction.amountOrigin
    })

    return sendResponse(res, 200, balance)
  } catch (error) {
    console.error('Error calculando el saldo de la cuenta:', error)
    throw error
  }
}

module.exports = {
  create,
  getAll,
  getById,
  calculateAccountBalance,
}
