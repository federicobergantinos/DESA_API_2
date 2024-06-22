// backend/configurations/database/config.js
const sequelize = require('../database/sequelizeConnection')
const {
  User,
  Transaction,
  Mission,
  Benefit,
  MetamaskAccount,
  ExchangeRate,
  UserTokens,
} = require('../../entities/associateModels')
const {
  populateTransactions,
  populateUser,
  populateMissions,
  populateBenefits,
  populateMetamaskAccounts,
  populateExchangeRates,
} = require('./initialData')
const createLogger = require('../Logger')
const logger = createLogger(__filename)

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync()
    // await sequelize.sync({ force: true })

    const usersCount = await User.count()
    const transactionsCount = await Transaction.count()
    const missionsCount = await Mission.count()
    const metamaskAccountsCount = await MetamaskAccount.count()
    const exchangeRatesCount = await ExchangeRate.count()
    const benefitCount = await Benefit.count()

    if (usersCount === 0) {
      await populateUser()
    }

    if (transactionsCount === 0) {
      await populateTransactions()
    }

    if (missionsCount === 0) {
      await populateMissions()
    }

    if (metamaskAccountsCount === 0) {
      await populateMetamaskAccounts()
    }

    if (exchangeRatesCount === 0) {
      await populateExchangeRates()
    }

    if (benefitCount === 0) {
      await populateBenefits()
    }

    logger.info('Database online')
  } catch (error) {
    console.error('There is an error starting database', {
      message: error.message,
      stack: error.stack,
      original: error.original,
    })
    throw new Error('There is an error starting database')
  }
}

module.exports = {
  dbConnection,
}
