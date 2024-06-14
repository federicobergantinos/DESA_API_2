require('dotenv').config()
const AWS = require('aws-sdk')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' })

const sqs = new AWS.SQS()
const queueUrl = process.env.WALLET_QUEUE_URL

const sendMessageToSQS = async (messageBody) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  }

  try {
    const data = await sqs.sendMessage(params).promise()
    logger.info(`Mensaje enviado a SQS: ${data.MessageId}`)
  } catch (error) {
    console.error(`Error enviando mensaje a SQS: ${error.message}`)
    throw error
  }
}

module.exports = { sendMessageToSQS }
