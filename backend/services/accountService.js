const Account = require('../entities/account')
const BadRequest = require('../Errors/BadRequest')
const NotFound = require('../Errors/NotFound')

const createAccount = async (accountData) => {
  const newAccount = await Account.create(accountData)

  return {
    id: newAccount.id,
  }
}

const isValidAccount = async (accountId) => {
  const existingAccount = await Account.findByPk(accountId)
  return existingAccount !== null
}

const findAccountById = async (accountId) => {
  const account = await User.findByPk(accountId)
  if (account === null) {
    throw new NotFound('Account not found')
  }

  return account
}

const findFirstAccountByUserId = async (userId) => {
  const account = await Account.findOne({
    where: { userId: userId },
    order: [['id', 'ASC']],
  })

  if (!account) {
    throw new NotFound('No account found for the given user ID')
  }

  return account
}

module.exports = {
  createAccount,
  isValidAccount,
  findAccountById,
  findFirstAccountByUserId,
}
