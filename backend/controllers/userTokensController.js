const {
  createUserTokens,
  getUserTokens,
  updateUserTokens,
  getUserTokenBalance,
} = require('../services/userTokensService')
const { sendResponse } = require('../configurations/utils')

const create = async (req, res) => {
  try {
    const { userId, tokens } = req.body
    const userTokens = await createUserTokens(userId, tokens)
    return sendResponse(res, 201, userTokens)
  } catch (error) {
    console.error(`Error creating user tokens: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const userTokens = await getUserTokens(userId)
    return sendResponse(res, 200, userTokens)
  } catch (error) {
    console.error(`Error getting user tokens: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const update = async (req, res) => {
  try {
    const { userId, tokens } = req.body
    const userTokens = await updateUserTokens(userId, tokens)
    return sendResponse(res, 200, userTokens)
  } catch (error) {
    console.error(`Error updating user tokens: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getBalance = async (req, res) => {
  try {
    const { userId } = req.params
    const balance = await getUserTokenBalance(userId)
    return sendResponse(res, 200, balance)
  } catch (error) {
    console.error(`Error getting user token balance: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = {
  create,
  getByUserId,
  update,
  getBalance,
}
