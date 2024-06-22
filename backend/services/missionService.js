const Mission = require('../entities/mission')

const createMissionsForUser = async (userId, transaction) => {
  const missions = [
    {
      key: 'profile',
      title: 'Completar Perfil',
      description: 'Completa la información de tu perfil',
      reward: 100,
      claimed: false,
      fulfilled: false,
      userId,
    },
    {
      key: 'transaction',
      title: 'Primera Transacción',
      description: 'Realiza tu primera transacción',
      reward: 200,
      claimed: false,
      fulfilled: false,
      userId,
    },
    {
      key: 'email',
      title: 'Verificar Correo Electrónico',
      description: 'Verifica tu correo electrónico',
      reward: 50,
      fulfilled: false,
      claimed: false,
      userId,
    },
    {
      key: 'daily',
      title: 'Primer Ingreso Diario',
      description: 'Ingresa a la aplicación por primera vez en un día',
      reward: 30,
      fulfilled: false,
      claimed: false,
      userId,
    },
  ]

  await Mission.bulkCreate(missions, { transaction })
}

const getAllMissions = async () => {
  return await Mission.findAll()
}

const getMissionById = async (missionId) => {
  return await Mission.findByPk(missionId)
}

const updateMissionByKey = async (userId, key, updates) => {
  const mission = await Mission.findOne({ where: { userId, key } })
  if (!mission) {
    throw new Error('Mission not found')
  }
  return mission.update(updates)
}

const deleteMissionService = async (missionId) => {
  const mission = await Mission.findByPk(missionId)
  if (!mission) {
    throw new Error('Mission not found')
  }
  await mission.destroy()
}

const getUserMissionsService = async (userId) => {
  const missions = await Mission.findAll({ where: { userId } })
  console.log(missions)
  return missions || []
}

module.exports = {
  createMissionsForUser,
  getAllMissions,
  getMissionById,
  getUserMissionsService,
  updateMissionByKey,
  deleteMissionService,
}
