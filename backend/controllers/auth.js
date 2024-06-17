const { createUser, findUserByEmail } = require('../services/userService')
const {
  createAccount,
  getAvailableMetamaskAccounts,
  markMetamaskAccountAsUsed,
} = require('../services/accountService')
const { createMissionsForUser } = require('../services/missionService')
const {
  createAuthTokens,
  loginUser,
  refreshToken,
  deleteCredentials,
} = require('../services/authService')
const { sendMessageToSNS } = require('../utils/snsSender')
const { verify } = require('jsonwebtoken')
const Unauthorized = require('../Errors/Unauthorized')
const { sendResponse } = require('../configurations/utils.js')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)
const sequelize = require('../configurations/database/sequelizeConnection')
const { v4: uuidv4 } = require('uuid')

const authenticate = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    logger.info('Starting processing request.')
    const googleToken = req.body.token
    const registerUser = req.body.registerUser
    const accountInfo = req.body.accountInfo
    const email = req.body.email
    const accessToken = req.headers['authorization']
    const additionalData = req.body.additionalData

    let user = null
    let tokens = null
    if (googleToken !== null) {
      const userData = await loginUser(googleToken, accessToken)

      if (email !== null || email !== undefined) {
        userData.email = email
      }
      user = await findUserByEmail(userData.email)

      if (registerUser === true) {
        // Obtener cuentas de Metamask disponibles
        const availableMetamaskAccounts = await getAvailableMetamaskAccounts()
        if (availableMetamaskAccounts.length < 1) {
          await transaction.rollback()
          return sendResponse(res, 400, {
            msg: 'No hay suficientes cuentas de Metamask disponibles para XCoin',
          })
        }

        // Tomar la primera cuenta disponible para XCoin
        const metamaskAccount = availableMetamaskAccounts[0]

        // Primero, crea el usuario
        user = await createUser(userData, { transaction })

        // Crear las cuentas utilizando UUID para Pesos y Dólares y cuenta de Metamask para XCoin
        const accountDataList = [
          {
            beneficiaryName: userData.name + ' ' + userData.surname,
            accountNumber: uuidv4(),
            beneficiaryAddress: '',
            accountType: 'Pesos',
            accountCurrency: 'ARS',
            accountStatus: 'pending',
            userId: user.id,
          },
          {
            beneficiaryName: userData.name + ' ' + userData.surname,
            accountNumber: uuidv4(),
            beneficiaryAddress: '',
            accountType: 'Dólares',
            accountCurrency: 'USD',
            accountStatus: 'pending',
            userId: user.id,
          },
          {
            beneficiaryName: userData.name + ' ' + userData.surname,
            accountNumber: metamaskAccount.accountNumber,
            beneficiaryAddress: '',
            accountType: 'XCoin',
            accountCurrency: 'XCN',
            accountStatus: 'pending',
            userId: user.id,
          },
        ]

        // Crear las cuentas y marcar la cuenta de Metamask como usada
        await Promise.all(
          accountDataList.map((accountData) =>
            createAccount(accountData, { transaction })
          )
        )
        await markMetamaskAccountAsUsed(metamaskAccount.accountNumber, {
          transaction,
        })

        await createMissionsForUser(user.id) // Crear misiones para el usuario

        // Crear el payload para SNS
        const payload = {
          operationType: 'CreateUser',
          data: {
            immovables: additionalData.immovables,
            hasTesla: additionalData.hasTesla,
            employmentSituation: additionalData.employmentSituation,
            monthlyIncome: additionalData.monthlyIncome,
            pictureSelfie: additionalData.pictureSelfie,
            pictureIdPassport: additionalData.pictureIdPassport,
            firstName: userData.name,
            lastName: userData.surname,
            email: userData.email,
          },
        }
        // Enviar mensaje a SNS
        await sendMessageToSNS(payload)
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
      if (email !== null || email !== undefined) {
        userData.email = email
      }

      const userData = await findUserByEmail(decode.email)
      if (userData !== null) {
        user = userData.dataValues
      }
    } else {
      await transaction.rollback()
      return sendResponse(res, 400, { msg: 'invalid credentials' })
    }

    if (user === null) {
      await transaction.rollback()
      return sendResponse(res, 301, {
        msg: 'User needs to complete registration',
      })
    } else {
      tokens = createAuthTokens(user)
      const statusCode = registerUser ? 201 : 200
      logger.info(statusCode)
      await transaction.commit()
      return sendResponse(res, statusCode, {
        id: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
    }
  } catch (error) {
    await transaction.rollback()
    console.error(`${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
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
      msg: error.message || 'An exception has occurred',
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
      msg: 'An exception has occurred',
    })
  }
}

module.exports = {
  authenticate,
  refresh,
  deleteCredential,
}
