// routes/benefitRoutes.js

const express = require('express')
const router = express.Router()

const {
  getAll,
  getById,
  update,
  deleteBenefit,
} = require('../controllers/benefitController')

router.get('/', getAll)
router.get('/:benefitId', getById)
router.put('/:benefitId', update)
router.delete('/:benefitId', deleteBenefit)

module.exports = router
