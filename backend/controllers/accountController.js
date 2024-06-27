const {
  createAccount,
  findAccountByUserId,
  findAccountById,
  findAccountByEmail,
  deleteAccountById,
  getAvailableMetamaskAccountsService,
  markMetamaskAccountAsUsedService,
} = require('../services/accountService')
const { sendResponse } = require('../configurations/utils.js')

const create = async (req, res) => {
  try {
    const accountId = await createAccount(req.body)
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

    if (accounts && accounts.length > 0) {
      const accountDetails = accounts.map((account) => ({
        accountId: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountCurrency: account.accountCurrency,
        accountStatus: account.accountStatus,
      }))

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

const getAvailableMetamaskAccounts = async (req, res) => {
  try {
    const accounts = await getAvailableMetamaskAccountsService()
    return sendResponse(res, 200, accounts)
  } catch (error) {
    console.error(`Error fetching available MetaMask accounts: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const markMetamaskAccountAsUsed = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber
    await markMetamaskAccountAsUsedService(accountNumber)
    return sendResponse(res, 200, {
      message: 'MetaMask account marked as used',
    })
  } catch (error) {
    console.error(`Error marking MetaMask account as used: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getAccountNumberByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const accountNumber = await findAccountByEmail(email);
    return sendResponse(res, 200, { accountNumber });
  } catch (error) {
    console.error(`Error fetching account number: ${error}`);
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    });
  }
};

module.exports = {
  create,
  getById,
  getAccountsByUserId,
  deleteAccount,
  getAvailableMetamaskAccounts,
  markMetamaskAccountAsUsed,
  getAccountNumberByEmail,
}
