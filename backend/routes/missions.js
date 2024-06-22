const express = require('express')
const router = express.Router()

const {
  create,
  getAll,
  getById,
  update,
  deleteMission,
  updateByKey,
  getUserMissions,
} = require('../controllers/missionController')

router.post('/create', create)
router.get('/', getAll)
router.get('/:missionId', getById)
router.put('/:missionId', update)
router.put('/updateByKey/:key', updateByKey)
router.delete('/:missionId', deleteMission)
router.get('/user/:userId', getUserMissions)

module.exports = router
