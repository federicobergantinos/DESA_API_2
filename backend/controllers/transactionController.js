const {
  createTransaction,
  getTransactions,
  getTransaction,
} = require('../services/transactionService')
const { v4: uuidv4 } = require('uuid')

const create = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
    }
    const transactionId = await createTransaction(transactionData)

    res.status(201).json({
      id: transactionId,
      message: 'Receta creada con éxito',
    })
  } catch (error) {
    console.error(`Error en la creación de la receta: ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'Ha ocurrido una excepción',
    })
  }
}

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 0 // Asegúrate de proporcionar un valor por defecto
  const limit = parseInt(req.query.limit) || 20 // Límite de ítems por página
  const offset = page * limit
  console.log(req.query)
  const accountId = req.query.accountId

  try {
    const response = await getTransactions({ limit, offset, accountId })

    res.status(200).json(response)
  } catch (error) {
    console.error(` ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getById = async (req, res) => {
  try {
    const transactionId = req.params.transactionId
    const response = await getTransaction(transactionId)
    const transaction = response.dataValues

    res.status(200).json({
      ...transaction,
    })
  } catch (error) {
    console.error(` ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has occurred',
    })
  }
}

const calculateAccountBalance = async (accountId) => {
  try {
    const transactions = await getTransactions({ accountId })

    let balance = 0

    transactions.forEach((transaction) => {
      balance += transaction.amount
    })

    console.log(transactions)

    return balance
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
