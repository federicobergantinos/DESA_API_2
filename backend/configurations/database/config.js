const sequelize = require('../database/sequelizeConnection')
const {
  User,
  Transaction,
  Media,
  Account,
} = require('../../entities/associateModels')
const { populateTransactions, populateUser } = require('./initialData')
const createLogger = require('../Logger')
const logger = createLogger(__filename)

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    const usersCount = await User.count()
    const transactionsCount = await Transaction.count()

    if (usersCount === 0) {
      await populateUser()
    }

    if (transactionsCount === 0) {
      await populateTransactions()
    }

    logger.info('Database online')
  } catch (error) {
    logger.error('There is an error starting database', error)
    throw new Error('There is an error starting database')
  }
}

module.exports = {
  dbConnection,
}
