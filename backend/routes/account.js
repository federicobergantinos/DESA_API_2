const express = require('express')
const router = express.Router()

const {
  create,
  getAccountsByUserId,
  getById,
  deleteAccount,
} = require('../controllers/accountController')

router.post('/create', create)
router.get('/', getAccountsByUserId)
router.get('/:accountId', getById)

module.exports = router
