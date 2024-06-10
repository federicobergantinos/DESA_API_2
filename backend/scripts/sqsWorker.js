require('dotenv').config()
const AWS = require('aws-sdk')
const { dbConnection } = require('../configurations/database/config')
const createLogger = require('../configurations/Logger')
const ProcessedMessage = require('../entities/processedMessages') 
const logger = createLogger(__filename)

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' })

const sqs = new AWS.SQS()

const queueUrls = {
  coreBancario: process.env.CORE_BANCARIO_QUEUE_URL,
  inHouse: process.env.INHOUSE_QUEUE_URL,
  crypto: process.env.CRYPTO_QUEUE_URL,
}

// Conectar a la base de datos principal
dbConnection().then(() => {
  logger.info('Database connection established successfully.')
  startWorkers()
}).catch(error => {
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
    VisibilityTimeout: 30,
    WaitTimeSeconds: 20,
  }

  try {
    const data = await sqs.receiveMessage(params).promise()
    if (data.Messages && data.Messages.length > 0) {
      const message = data.Messages[0]
      logger.info(`Mensaje recibido de ${queueUrl}: ${message.Body}`)

      try {
        // Verificar si el mensaje ya ha sido procesado
        const rows = await ProcessedMessage.findAll({
          where: {
            message_id: message.MessageId
          }
        })
        if (rows.length > 0) {
          logger.debug(`Mensaje ya procesado: ${message.MessageId}`)
          return
        }

        await handleMessage(message)

        // Registrar el mensaje como procesado
        await ProcessedMessage.create({
          queue_name: queueUrl,
          message_id: message.MessageId,
          body: message.Body,
          status: 'processed'
        })
      } catch (error) {
        logger.error(`Error procesando el mensaje: ${error.message}`)
        
        // Registrar el mensaje como error
        await ProcessedMessage.create({
          queue_name: queueUrl,
          message_id: message.MessageId,
          body: message.Body,
          status: 'error',
          error_message: error.message
        })
      }
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
    
    // Simular un error para mensajes inválidos
    if (messageBody.invalid) {
      throw new Error('Mensaje inválido')
    }

    console.log(messageBody)
  } catch (error) {
    logger.error(`Error parsing message body: ${error.message}`)
    throw error
  }
}

function startWorkers() {
  Object.values(queueUrls).forEach(queueUrl => {
    if (!queueUrl) {
      logger.error('Queue URL is undefined for one of the queues')
      return
    }
    setInterval(() => processMessage(queueUrl), 10000)
  })
}
