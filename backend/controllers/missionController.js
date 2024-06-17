const {
  createMissionsForUser,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMissionService,
  updateMissionByKey,
} = require('../services/missionService')
const { sendResponse } = require('../configurations/utils.js')

const create = async (req, res) => {
  try {
    const { userId, transaction } = req.body
    const mission = await createMissionsForUser(userId, transaction)
    return sendResponse(res, 201, mission)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getAll = async (req, res) => {
  try {
    const missions = await getAllMissions()
    return sendResponse(res, 200, missions)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getById = async (req, res) => {
  try {
    const mission = await getMissionById(req.params.missionId)
    return sendResponse(res, 200, mission)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const update = async (req, res) => {
  try {
    const updatedMission = await updateMission(req.params.missionId, req.body)
    return sendResponse(res, 200, updatedMission)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const updateByKey = async (req, res) => {
  try {
    const { userId } = req.body
    const { key } = req.params
    const updates = req.body
    const updatedMission = await updateMissionByKey(userId, key, updates)
    return sendResponse(res, 200, updatedMission)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const deleteMission = async (req, res) => {
  try {
    await deleteMissionService(req.params.missionId)
    return res.status(204).send()
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteMission,
  updateByKey,
}
