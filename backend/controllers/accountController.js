const {
  createAccount,
  findAccountByUserId,
  findAccountById,
  deleteAccountById,
  getAvailableMetamaskAccounts,
  markMetamaskAccountAsUsed,
} = require('../services/accountService')
const { findUserById } = require('../services/userService')
const { sendResponse } = require('../configurations/utils.js')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const create = async (req, res) => {
  try {
    // Buscar una cuenta de Metamask disponible
    const availableMetamaskAccounts = await getAvailableMetamaskAccounts()
    if (availableMetamaskAccounts.length === 0) {
      return sendResponse(res, 400, {
        msg: 'No available Metamask accounts',
      })
    }

    // Tomar la primera cuenta disponible
    const metamaskAccount = availableMetamaskAccounts[0]

    const accountData = {
      ...req.body,
      accountNumber: metamaskAccount.accountNumber, // Usar la cuenta de Metamask disponible
    }

    const accountId = await createAccount(accountData)

    // Marcar la cuenta de Metamask como usada
    await markMetamaskAccountAsUsed(metamaskAccount.accountNumber)

    return sendResponse(res, 201, {
      id: accountId,
      message: 'La cuenta creada con éxito',
    })
  } catch (error) {
    console.error(`Error en la creación de la cuenta: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'Ha ocurrido una excepción',
    })
  }
}

const getById = async (req, res) => {
  try {
    const accountId = req.params.accountId
    const response = await findAccountById(accountId)
    const account = response.dataValues

    return sendResponse(res, 200, {
      ...account,
    })
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id // Asumiendo que el userId se obtiene del token de autenticación
    await deleteAccountById(userId)

    return sendResponse(res, 200, { message: 'Account deleted successfully' })
  } catch (error) {
    console.error(`Error deleting account: ${error}`)
    return sendResponse(res, error.code || 500, {
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
        accountCurrency: account.accountCurrency,
        accountStatus: account.accountStatus,
      }))

      // Devolver la lista de objetos.
      return sendResponse(res, 200, accountDetails)
    } else {
      return sendResponse(res, 404, {
        message: 'No accounts found for the given user ID',
      })
    }
  } catch (error) {
    console.error(`Error fetching accounts by user ID: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = {
  create,
  getById,
  getAccountsByUserId,
  deleteAccount,
}
