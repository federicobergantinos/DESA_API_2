const UserTokens = require('../entities/userTokens')
const User = require('../entities/user')
const NotFound = require('../Errors/NotFound')

const createUserTokens = async (userId, tokens) => {
  try {
    // Verificar si el usuario existe
    const user = await User.findByPk(userId)
    if (!user) {
      throw new NotFound('User not found')
    }

    // Crear un registro de tokens para el usuario
    const userTokens = await UserTokens.create({ userId, tokens })
    return userTokens
  } catch (error) {
    throw error
  }
}

const getUserTokens = async (userId) => {
  try {
    const userTokens = await UserTokens.findAll({ where: { userId } })
    if (!userTokens || userTokens.length === 0) {
      return { tokens: 0 } // Retorna 0 si no hay registros
    }

    // Calcular el balance sumando todos los tokens
    const balance = userTokens.reduce((acc, record) => acc + record.tokens, 0)
    return { userId, tokens: balance }
  } catch (error) {
    throw error
  }
}

const updateUserTokens = async (userId, tokens) => {
  try {
    // Crear un nuevo registro de tokens (incremento o decremento)
    const userTokens = await createUserTokens(userId, tokens)
    return userTokens
  } catch (error) {
    throw error
  }
}

const getUserTokenBalance = async (userId) => {
  try {
    const userTokens = await UserTokens.findAll({ where: { userId } })
    if (!userTokens || userTokens.length === 0) {
      return { userId, balance: 0 }
    }

    const balance = userTokens.reduce((acc, record) => acc + record.tokens, 0)
    return { userId, balance }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createUserTokens,
  getUserTokens,
  updateUserTokens,
  getUserTokenBalance,
}
