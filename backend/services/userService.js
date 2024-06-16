const User = require('../entities/user')
const InternalError = require('../Errors/InternalError')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const NotFound = require('../Errors/NotFound')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const createUser = async (userData) => {
  if (await findUserByEmail(userData.email)) {
    throw new InternalError('The user exists')
  }

  const newUser = await User.create(userData)

  const token = getToken(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  }
}

const isValidUser = async (userId) => {
  const existingUser = await User.findByPk(userId)
  return existingUser !== null
}

const findUserById = async (userId) => {
  const user = await User.findByPk(userId)
  if (user === null) {
    throw new NotFound('User not found')
  }

  return user
}

const findUserByEmail = async (email) => {
  return User.findOne({
    where: { email: email },
    attributes: ['id', 'name', 'surname', 'email'],
  })
}

function getToken(newUser) {
  const payload = { userId: newUser.id, email: newUser.email }
  const accessOptions = { expiresIn: '1h' }
  const refreshOptions = { expiresIn: '30d' }
  const accessToken = jwt.sign(payload, process.env.CODE, accessOptions)
  const refreshToken = jwt.sign(payload, process.env.CODE, refreshOptions)
  return { refreshToken, accessToken }
}

const updateUserProfile = async (userId, updateData) => {
  const [updatedRows] = await User.update(updateData, {
    where: { id: userId },
  })

  if (updatedRows > 0) {
    return User.findByPk(userId)
  } else {
    throw new Error('User not found')
  }
}

const deactivateUserService = async (userId) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw new NotFound('User not found')
  }

  user.userStatus = false
  user.email = `${uuidv4()}@deleted.com`
  await user.save()

  return user
}

module.exports = {
  createUser,
  isValidUser,
  findUserById,
  findUserByEmail,
  updateUserProfile,
  deactivateUserService,
}
