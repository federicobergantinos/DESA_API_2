const sequelize = require('../database/sequelizeConnection')
const {
  User,
  Transaction,
  Media,
  Account,
  Contact,
  Mission,
  MetamaskAccount, // Asegúrate de importar el modelo MetamaskAccount
} = require('../../entities/associateModels')
const {
  populateTransactions,
  populateUser,
  populateMissions,
  populateMetamaskAccounts, // Agrega la función de populación de MetamaskAccounts
} = require('./initialData')
const createLogger = require('../Logger')
const logger = createLogger(__filename)

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    // await sequelaize.sync({ force: true })

    const usersCount = await User.count()
    const transactionsCount = await Transaction.count()
    const missionsCount = await Mission.count()
    const metamaskAccountsCount = await MetamaskAccount.count()

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
