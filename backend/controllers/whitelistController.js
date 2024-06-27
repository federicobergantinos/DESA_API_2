// controllers/whitelistController.js
const { isEmailInWhitelist } = require('../services/whitelistService')
const { sendResponse } = require('../configurations/utils.js')

const checkIfEmailInWhitelist = async (req, res) => {
  try {
    const { email } = req.query
    const isWhitelisted = await isEmailInWhitelist(email)
    return sendResponse(res, 200, { isWhitelisted })
  } catch (error) {
    console.error(`Error checking whitelist: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = { checkIfEmailInWhitelist }
