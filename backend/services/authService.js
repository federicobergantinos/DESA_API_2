const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const Authorization = require('../entities/auth')
const Unauthorized = require('../Errors/Unauthorized')
const { findUserById } = require('./userService')
const client = new OAuth2Client()

const createAuthTokens = (user) => {
  const payload = { id: user.id, email: user.email }
  const accessOptions = { expiresIn: '1h' }
  const refreshOptions = { expiresIn: '30d' }
  const accessToken = jwt.sign(payload, process.env.CODE, accessOptions)
  const refreshToken = jwt.sign(payload, process.env.CODE, refreshOptions)
  saveInDb(accessToken, refreshToken, user.id)
  return { refreshToken, accessToken }
}

const loginUser = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        '454272373471-tn1ohih0qgcirgp0qutdlb29t3jq6ffm.apps.googleusercontent.com',
        '454272373471-q44bdocglaj0albbqn0qjr0ienfduh05.apps.googleusercontent.com',
        '454272373471-5ojg0h21n0et134lvfjgokb9j0ovpsi8.apps.googleusercontent.com',
        '454272373471-0rikgi4sqndi5ge4gibbsccu690c4813.apps.googleusercontent.com',
      ],
    })
    const payload = ticket.getPayload()
    return {
      name: payload.given_name,
      surname: payload.family_name,
      email: payload.email,
      photoUrl: payload.picture,
    }
  } catch (e) {
    throw new Unauthorized('Invalid token')
  }
}

const refreshToken = async (accessToken, refreshToken) => {
  const auth = await Authorization.findOne({
    where: { accessToken: accessToken, refreshToken: refreshToken },
  })
  if (auth === null) {
    throw new Unauthorized('Unauthorized')
  }

  const user = await findUserById(auth.userId)

  Authorization.destroy({ where: { id: auth.id } })
  return createAuthTokens(user)
}

const saveInDb = async (accessToken, refreshToken, userId) => {
  await Authorization.create({
    userId: userId,
    accessToken: accessToken,
    refreshToken: refreshToken,
  })
}

const deleteCredentials = async (accessToken) => {
  await User.destroy({ where: { id: userId } })
  await Authorization.destroy({ where: { accessToken: accessToken } })
}

module.exports = {
  loginUser,
  createAuthTokens,
  refreshToken,
  deleteCredentials,
}
