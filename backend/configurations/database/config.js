const sequelize = require('../database/sequelizeConnection')
const {
  User,
  Transaction,
  Media,
  Account,
  Contact,
  Mission, // Asegúrate de importar el modelo Mission
} = require('../../entities/associateModels')
const {
  populateTransactions,
  populateUser,
  populateMissions,
} = require('./initialData') // Agrega populateMissions
const createLogger = require('../Logger')
const logger = createLogger(__filename)

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    // await sequelize.sync({ force: true })

    const usersCount = await User.count()
    const transactionsCount = await Transaction.count()
    const missionsCount = await Mission.count() // Cuenta las misiones

    if (usersCount === 0) {
      await populateUser()
    }

    if (transactionsCount === 0) {
      await populateTransactions()
    }

    if (missionsCount === 0) {
      await populateMissions()
    }

    logger.info('Database online')
  } catch (error) {
    logger.error('There is an error starting database', {
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
