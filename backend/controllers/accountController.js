const {
  createAccount,
  findFirstAccountByUserId,
} = require('../services/accountService')
const { findUserById } = require('../services/userService')
const { v4: uuidv4 } = require('uuid')

const create = async (req, res) => {
  try {
    const accountData = {
      ...req.body,
    }
    const accountId = await createAccount(accountData)

    res.status(201).json({
      id: accountId,
      message: 'La cuenta creada con éxito',
    })
  } catch (error) {
    console.error(`Error en la creación de la cuenta: ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'Ha ocurrido una excepción',
    })
  }
}

const getById = async (req, res) => {
  try {
    const accountId = req.params.accountId
    const response = await getAccount(accountId)
    const account = response.dataValues

    res.status(200).json({
      ...account,
    })
  } catch (error) {
    console.error(` ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has occurred',
    })
  }
}
// Función sleep que retorna una promesa que se resuelve después de un tiempo específico
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getByUserId = async (req, res) => {
  try {
    const userId = req.params.userId

    // Supongamos que quieres hacer una pausa de 2 segundos antes de buscar la cuenta
    await sleep(2000) // Pausa de 2 segundos

    const response = await findFirstAccountByUserId(userId)
    console.log('response', response)

    const account = response.dataValues
    console.log('account', account)

    res.status(200).json({
      ...account,
    })
  } catch (error) {
    console.error(` ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = {
  create,
  getById,
  getByUserId,
}
