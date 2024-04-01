const express = require('express')
const router = express.Router()

const { create, getByUserId } = require('../controllers/accountController')

router.post('/create', create)
router.get('/firstAccount/:userId', getByUserId)

module.exports = router
