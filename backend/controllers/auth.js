const { createUser, findUserByEmail } = require('../services/userService')
const {
  createAuthTokens,
  loginUser,
  refreshToken,
  deleteCredentials,
} = require('../services/authService')
const { verify } = require('jsonwebtoken')
const Unauthorized = require('../Errors/Unauthorized')
const authenticate = async (req, res) => {
  try {
    const googleToken = req.body.token
    const accessToken = req.headers['authorization']

    let user = null
    let tokens = null
    if (googleToken !== null) {
      const userData = await loginUser(googleToken, accessToken)
      user = await findUserByEmail(userData.email)
      if (!user) {
        user = await createUser(userData)
      }
      tokens = createAuthTokens(user)
    } else if (accessToken !== null) {
      const decode = verify(accessToken, process.env.CODE, (err, decoded) => {
        if (err) {
          console.log('ERROR', err)
          throw new Unauthorized('Invalid credentials')
        } else {
          return decoded
        }
      })
      const userData = await findUserByEmail(decode.email)
      user = userData.dataValues
      tokens = createAuthTokens(user)
    } else {
      res.status(400).json({ msg: 'invalid credentials' })
      return
    }

    res.status(201).json({
      id: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    console.error(`${error}`)
    res.status(error.code || 500).json({
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

    res.status(201).json({
      id: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    console.error(` ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has ocurred',
    })
  }
}

const deleteCredential = async (req, res) => {
  try {
    const accessToken = req.headers['authorization']
    deleteCredentials(accessToken)
    res.status(204).send()
  } catch (error) {
    console.error(` ${error}`)
    res.status(error.code || 500).json({
      msg: error.message || 'An exception has ocurred',
    })
  }
}

module.exports = {
  authenticate,
  refresh,
  deleteCredential,
}
