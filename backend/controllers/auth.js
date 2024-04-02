const { createUser, findUserByEmail } = require('../services/userService')
const {
  createAuthTokens,
  loginUser,
  refreshToken,
  deleteCredentials,
} = require('../services/authService')
const { verify } = require('jsonwebtoken')
const Unauthorized = require('../Errors/Unauthorized')
const { sendResponse } = require('../configurations/utils.js')

const authenticate = async (req, res) => {
  try {
    console.info('Starting processing authenticate request.')
    const googleToken = req.body.token
    const registerUser = req.body.registerUser
    const accessToken = req.headers['authorization']

    let user = null
    let tokens = null

    if (googleToken !== null) {
      const userData = await loginUser(googleToken, accessToken)
      user = await findUserByEmail(userData.email)
      if (registerUser === true) {
        user = await createUser(userData)
      }
    } else if (accessToken !== null) {
      const decode = verify(accessToken, process.env.CODE, (err, decoded) => {
        if (err) {
          console.error('ERROR', err)
          throw new Unauthorized('Invalid credentials')
        } else {
          return decoded
        }
      })
      const userData = await findUserByEmail(decode.email)
      user = userData.dataValues
    } else {
      return sendResponse(res, 400, { msg: 'invalid credentials' })
    }

    if (user === null) {
      // Si el usuario no existe, devuelve un código de estado 301 (redirección)
      return sendResponse(res, 301, {
        msg: 'User needs to complete registration',
      })
    } else if (user !== null) {
      // Si el usuario existe, genera los tokens y devuelve la respuesta con código 200
      tokens = createAuthTokens(user)
      if (registerUser) {
        statusCode = 201
      } else {
        statusCode = 200
      }
      return sendResponse(res, statusCode, {
        id: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
    } else {
      return sendResponse(res, 500, {
        msg: 'Internal error',
      })
    }
  } catch (error) {
    console.error(`${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has ocurred',
    })
  }
}

const refresh = async (req, res) => {
  try {
    const accessToken = req.headers['authorization']
    const refresh = req.body.refreshToken

    let user = await refreshToken(accessToken, refresh)
    const tokens = createAuthTokens(user)

    return sendResponse(res, 200, {
      id: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has ocurred',
    })
  }
}

const deleteCredential = async (req, res) => {
  try {
    const accessToken = req.headers['authorization']
    deleteCredentials(accessToken)
    return res.status(204).send()
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has ocurred',
    })
  }
}

module.exports = {
  authenticate,
  refresh,
  deleteCredential,
}
