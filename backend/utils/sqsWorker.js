require('dotenv').config()
const {
  updateUserAccountStatusByEmail,
  findUserByEmail,
} = require('../services/userService')
const { updateTransactionStatus } = require('../services/transactionService')
const AWS = require('aws-sdk')
const { dbConnection } = require('../configurations/database/config')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' })

const sqs = new AWS.SQS()

const queueUrls = {
  walletService: process.env.WALLET_QUEUE_URL,
}

// Conectar a la base de datos principal
dbConnection()
  .then(() => {
    logger.info('Database connection established successfully.')
    startWorkers()
  })
  .catch((error) => {
    logger.error('Error establishing database connection:', error)
  })

async function processMessage(queueUrl) {
  if (!queueUrl) {
    logger.error('Queue URL is undefined')
    return
  }

  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 3,
  }

  try {
    const data = await sqs.receiveMessage(params).promise()
    if (data.Messages && data.Messages.length > 0) {
      await Promise.all(
        data.Messages.map(async (message) => {
          try {
            await handleMessage(message)

            // Eliminar el mensaje después de procesarlo exitosamente
            await sqs
              .deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              })
              .promise()

            logger.info(`Mensaje procesado y eliminado de ${queueUrl}`)
          } catch (error) {
            logger.error(`Error procesando el mensaje: ${error.message}`)
            logger.debug(`Contenido del mensaje: ${message.Body}`)

            // Eliminar el mensaje si el error es debido a un JSON inválido
            if (
              error.message.includes('Unexpected token') ||
              error.message.includes('Unexpected end of JSON input')
            ) {
              await sqs
                .deleteMessage({
                  QueueUrl: queueUrl,
                  ReceiptHandle: message.ReceiptHandle,
                })
                .promise()
              logger.info(
                `Mensaje con JSON inválido eliminado de ${queueUrl}: ${message.Body}`
              )
            }
          }
        })
      )
    } else {
      logger.debug(`No messages received from ${queueUrl}`)
    }
  } catch (error) {
    logger.debug(`Error procesando mensaje de ${queueUrl}: ${error.message}`)
  }
}

async function handleMessage(message) {
  try {
    const messageBody = JSON.parse(message.Body)
    const operationMessage = JSON.parse(messageBody.Message)

    if (!operationMessage.operationType || !operationMessage.data) {
      throw new Error('Invalid message structure')
    }

    switch (operationMessage.operationType) {
      case 'CreateUserClientConfirmation':
        await handleCreateUserClientConfirmation(operationMessage.data)
        break
      case 'CreateTransferXCNConfirmation':
        await handleTransactionConfirmation(
          operationMessage.data,
          'CreateTransferXCNConfirmation'
        )
        break
      case 'CreateBuyXCNConfirmation':
        await handleTransactionConfirmation(
          operationMessage.data,
          'CreateBuyXCNConfirmation'
        )
        break
      case 'CreateSellXCNConfirmation':
        await handleTransactionConfirmation(
          operationMessage.data,
          'CreateSellXCNConfirmation'
        )
        break
      case 'GetBalance':
        await handleGetBalance(operationMessage.data)
        break
      default:
        logger.error(
          `Unsupported operation type: ${operationMessage.operationType}`
        )
        break
    }
  } catch (error) {
    logger.error(`Error processing message: ${error.message}`)
    logger.debug(`Message content: ${message.Body}`)
    throw error
  }
}

async function handleTransactionConfirmation(data, operationType) {
  try {
    if (!data.transactionId || !data.status) {
      logger.error(`Invalid data structure for ${operationType}`)
      return
    }

    const { transactionId, status } = data

    // Actualizar el estado de la transacción en la base de datos
    await updateTransactionStatus(transactionId, status)
    logger.info(`Transaction status for ${transactionId} updated to ${status}`)
  } catch (error) {
    logger.error(`Error in ${operationType}: ${error.message}`)
    throw error
  }
}

// Función para manejar el caso 'CreateUserClientConfirmation'
async function handleCreateUserClientConfirmation(data) {
  try {
    if (!data.email || !data.status) {
      logger.error('Invalid data structure for CreateUserClientConfirmation')
      return
    }

    const { email, status } = data
    const formattedStatus = status.trim().toLowerCase()
    const updatedStatus =
      formattedStatus === 'approved' ? 'validated' : 'rejected'

    // Verificar si el usuario existe
    const user = await findUserByEmail(email)
    if (!user) {
      logger.error(`User with email ${email} not found`)
      return
    }

    // Actualizar el estado de la cuenta del usuario
    await updateUserAccountStatusByEmail(email, updatedStatus)
    logger.info(`User status for ${email} updated to ${updatedStatus}`)
  } catch (error) {
    logger.error(
      `Error in handleCreateUserClientConfirmation: ${error.message}`
    )
    throw error
  }
}

// Función para manejar otro caso de uso
async function handleGetBalance(data) {
  try {
    // Implementar lógica específica para 'CreateTransferXCNConfirmation'
  } catch (error) {
    logger.error(`Error in handleGetBalance: ${error.message}`)
    throw error
  }
}

function startWorkers() {
  Object.values(queueUrls).forEach((queueUrl) => {
    if (!queueUrl) {
      logger.error('Queue URL is undefined for one of the queues')
      return
    }
    setInterval(() => processMessage(queueUrl), 10000)
  })
}
