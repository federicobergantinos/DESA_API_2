const express = require('express')
const router = express.Router()

const {
  create,
  getAll,
  getById,
  calculateAccountBalance,
  createMoneyDeposit,
} = require('../controllers/transactionController')

router.post('/create', create)
router.get('/', getAll)
router.get('/balance', calculateAccountBalance)
router.get('/:transactionId', getById)
router.post('/deposit', createMoneyDeposit)

module.exports = router
