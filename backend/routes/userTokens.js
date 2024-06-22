const express = require('express')
const router = express.Router()
const {
  create,
  getByUserId,
  update,
  getBalance,
} = require('../controllers/userTokensController')

router.post('/create', create)
router.get('/:userId', getByUserId)
router.put('/update', update)
router.get('/balance/:userId', getBalance)

module.exports = router
