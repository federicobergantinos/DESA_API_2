const Account = require('../entities/account')
const MetamaskAccount = require('../entities/metamaskAccount')
const User = require('../entities/user')
const NotFound = require('../Errors/NotFound')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const createAccount = async (accountData) => {
  try {
    const newAccount = await Account.create(accountData)
    return {
      id: newAccount.id,
    }
  } catch (error) {
    throw error
  }
}

const findAccountByAccountNumber = async (accountNumber) => {
  const account = await Account.findOne({
    where: { accountNumber: accountNumber },
    include: [{ model: User, as: 'user' }],
  })
  return account
}

const findAccountById = async (accountId) => {
  const account = await Account.findByPk(accountId)
  if (account === null) {
    throw new NotFound('Account not found')
  }
  return account
}

const findAccountByUserId = async (userId) => {
  const account = await Account.findAll({
    where: { userId: userId },
    order: [['id', 'ASC']],
  })
  if (!account) {
    throw new NotFound('No account found for the given user ID')
  }
  return account
}

const deactivateAccountsByUserId = async (userId) => {
  try {
    await Account.update(
      { accountStatus: 'deactivated' },
      { where: { userId: userId } }
    )
  } catch (error) {
    throw error
  }
}

const getAvailableMetamaskAccounts = async () => {
  try {
    const accounts = await MetamaskAccount.findAll({
      where: { used: false },
      order: [['id', 'ASC']],
    })
    return accounts
  } catch (error) {
    throw error
  }
}

const markMetamaskAccountAsUsed = async (accountNumber) => {
  try {
    await MetamaskAccount.update(
      { used: true },
      { where: { accountNumber: accountNumber } }
    )
  } catch (error) {
    throw error
  }
}

module.exports = {
  createAccount,
  findAccountByAccountNumber,
  findAccountById,
  findAccountByUserId,
  deactivateAccountsByUserId,
  getAvailableMetamaskAccounts,
  markMetamaskAccountAsUsed,
}
