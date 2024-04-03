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

    await sequelize.sync({ force: true })

    // Sincronizar modelos con la base de datos
    await User.sync()
    await Account.sync()
    await Transaction.sync()
    await Media.sync()

    // Poblar la base de datos con datos iniciales
    await populateUser()
    await populateTransactions()

    logger.info('Database online')
  } catch (error) {
    logger.error('There is an error starting database', error)
    throw new Error('There is an error starting database')
  }
}

module.exports = {
  dbConnection,
}
