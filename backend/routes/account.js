const express = require('express')
const router = express.Router()

const {
  create,
  getAccountsByUserId,
  getById,
  deleteAccount,
  getAvailableMetamaskAccounts,
  markMetamaskAccountAsUsed,
} = require('../controllers/accountController')

router.post('/create', create)
router.get('/', getAccountsByUserId)
router.get('/:accountId', getById)
router.get('/metamask/available', getAvailableMetamaskAccounts)
router.put('/metamask/:accountNumber/used', markMetamaskAccountAsUsed)

module.exports = router
