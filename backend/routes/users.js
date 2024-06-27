const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()

const {
  getUser,
  editProfile,
  uploadImage,
  deactivateUser,
} = require('../controllers/userController')
const {
  checkIfEmailInWhitelist,
} = require('../controllers/whitelistController')

router.get('/:userId', getUser)
router.put('/:userId', editProfile)
router.post('/uploadImage', upload.single('image'), uploadImage)
router.delete('/:userId', deactivateUser)
router.get('/whitelist/check', checkIfEmailInWhitelist)

module.exports = router
