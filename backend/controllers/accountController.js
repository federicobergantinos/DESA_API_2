const {
  createAccount,
  findAccountByUserId,
  findAccountById,
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
    const response = await findAccountById(accountId)
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

const getAccountsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId // Asegurándose de usar query si es cómo se envía el userId.

    const accounts = await findAccountByUserId(userId)

    // Verificar que se encontraron cuentas antes de intentar acceder a sus propiedades.
    if (accounts && accounts.length > 0) {
      // Mapear cada cuenta a un objeto con los campos específicos que deseas incluir.
      const accountDetails = accounts.map((account) => ({
        accountId: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        // Puedes agregar más campos aquí según sea necesario.
      }))

      // Devolver la lista de objetos.
      res.status(200).json(accountDetails)
    } else {
      res.status(404).json({ msg: 'No accounts found for the given user ID' })
    }
  } catch (error) {
    console.error(`Error fetching accounts by user ID: ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = {
  create,
  getById,
  getAccountsByUserId,
}
