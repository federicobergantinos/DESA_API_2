const express = require('express')
const router = express.Router()

const {
  create,
  getAll,
  getById,
  calculateAccountBalance,
} = require('../controllers/transactionController')

router.post('/create', create)
router.get('/', getAll)
router.get('/balance', calculateAccountBalance)
router.get('/:transactionId', getById)

module.exports = router
