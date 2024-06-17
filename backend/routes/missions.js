const express = require('express')
const router = express.Router()

const {
  create,
  getAll,
  getById,
  update,
  deleteMission,
  updateByKey,
} = require('../controllers/missionController')

router.post('/create', create)
router.get('/', getAll)
router.get('/:missionId', getById)
router.put('/:missionId', update)
router.put('/updateByKey/:key', updateByKey)
router.delete('/:missionId', deleteMission)

module.exports = router
