const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()

const {
  getUser,
  editProfile,
  uploadImage,
} = require('../controllers/userController')

router.get('/:userId', getUser)
router.put('/:userId', editProfile)
router.post('/uploadImage', upload.single('image'), uploadImage)

module.exports = router
