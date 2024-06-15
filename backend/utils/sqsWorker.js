require('dotenv').config()
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
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 20,
  }

  try {
    const data = await sqs.receiveMessage(params).promise()
    if (data.Messages && data.Messages.length > 0) {
      await Promise.all(
        data.Messages.map(async (message) => {
          try {
            await handleMessage(message)

            // Eliminar el mensaje después de procesarlo
            await sqs
              .deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              })
              .promise()

            logger.info(
              `Mensaje procesado y eliminado de ${queueUrl}: ${message.Body}`
            )
          } catch (error) {
            logger.error(`Error procesando el mensaje: ${error.message}`)
          }
        })
      )
    } else {
      logger.debug(`No messages received from ${queueUrl}`)
    }
  } catch (error) {
    logger.error(`Error procesando mensaje de ${queueUrl}: ${error.message}`)
  }
}

async function handleMessage(message) {
  try {
    const messageBody = JSON.parse(message.Body)

    // Validar la estructura del mensaje
    if (!messageBody.operationType || !messageBody.data) {
      throw new Error('Invalid message structure')
    }

    // Despachar el mensaje al manejador correspondiente
    switch (messageBody.operationType) {
      case 'CreateUserClientConfirmation':
        await handleCreateUserClientConfirmation(messageBody.data)
        break
      case 'CreateTransferXCNConfirmation':
        await handleCreateTransferXCNConfirmation(messageBody.data)
        break
      case 'CreateBuyXCNConfirmation':
        await handleCreateBuyXCNConfirmation(messageBody.data)
        break
      case 'GetBalance':
        await handleGetBalance(messageBody.data)
        break
      default:
        break
    }
  } catch (error) {
    logger.error(`Error processing message: ${error.message}`)
    throw error
  }
}

// Función para manejar el caso 'CreateUserClientConfirmation'
async function handleCreateUserClientConfirmation(data) {
  try {
    if (!data.email || !data.status) {
      throw new Error('Invalid data structure for CreateUserClientConfirmation')
    }

    const { email, status } = data
    await updateUserAccountStatusByEmail(email, status)
  } catch (error) {
    logger.error(`Error in handleCreateUserClientConfirmation: ${error.message}`)
    throw error
  }
}

// Función para manejar otro caso de uso
async function handleCreateTransferXCNConfirmation(data) {
  try {
    // Implementar lógica específica para 'CreateTransferXCNConfirmation'
  } catch (error) {
    logger.error(`Error in handleCreateTransferXCNConfirmation: ${error.message}`)
    throw error
  }
}
// Función para manejar otro caso de uso
async function handleCreateBuyXCNConfirmation(data) {
  try {
    // Implementar lógica específica para 'CreateTransferXCNConfirmation'
  } catch (error) {
    logger.error(`Error in handleCreateBuyXCNConfirmation: ${error.message}`)
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
