// backend/configurations/database/initialData/populateWhitelist.js

const { Whitelist } = require('../../../entities/associateModels')
const createLogger = require('../../Logger')
const logger = createLogger(__filename)

const populateWhitelist = async () => {
  const whitelistData = [{ email: 'xwallet.company@gmail.com' }]

  try {
    for (const entry of whitelistData) {
      await Whitelist.create(entry)
    }

    logger.info('Whitelist has been populated.')
  } catch (error) {
    console.error('Error populating whitelist:', error)
  }
}

module.exports = populateWhitelist
