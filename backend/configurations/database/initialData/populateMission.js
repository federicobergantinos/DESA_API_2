const { Mission } = require('../../../entities/associateModels')
const createLogger = require('../../Logger')
const logger = createLogger(__filename)

const populateMissions = async () => {
  const missionsData = [
    {
      title: 'Misión 1',
      description: 'Descripción de la misión 1',
      reward: 100,
      claimed: true,
      userId: 1, // Cambia el userId según los usuarios creados
    },
    {
      title: 'Misión 2',
      description: 'Descripción de la misión 2',
      reward: 200,
      claimed: false,
      userId: 1,
    },
    // Más misiones según sea necesario
  ]

  try {
    for (const missionData of missionsData) {
      await Mission.create(missionData)
    }

    logger.info('Missions have been populated.')
  } catch (error) {
    logger.error('Error populating missions:', error)
  }
}

module.exports = populateMissions
