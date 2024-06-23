const User = require('../entities/user')
const Account = require('../entities/account')
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

  user.userStatus = 'desactivated'
  user.email = `${uuidv4()}@deleted.com`
  await user.save()

  return user
}

const updateUserAccountStatusByEmail = async (email, status) => {
  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new Error(`User with email ${email} not found`)
    }

    // Actualizar el estado de las cuentas del usuario
    await Account.update(
      { accountStatus: status },
      { where: { userId: user.id, accountStatus: 'pending' } }
    )

    // Actualizar el estado del usuario
    await user.update({
      userStatus: status,
    })

    logger.info(`User and accounts for email ${email} updated to ${status}`)
  } catch (error) {
    console.error(`Error updating account status: ${error.message}`)
    throw error
  }
}

module.exports = {
  createUser,
  isValidUser,
  findUserById,
  findUserByEmail,
  updateUserAccountStatusByEmail,
  updateUserProfile,
  deactivateUserService,
}
