require('dotenv').config()
const AWS = require('aws-sdk')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' })

const sns = new AWS.SNS()
const topicArn = process.env.SNS_TOPIC_ARN

const sendMessageToSNS = async (messageBody) => {
  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(messageBody),
  }
  console.log('Payload to SNS:', params.Message, messageBody)

  try {
    const data = await sns.publish(params).promise()
    logger.info(`Mensaje enviado a SNS: ${data.MessageId}`)
  } catch (error) {
    console.error(`Error enviando mensaje a SNS: ${error.message}`)
    throw error
  }
}

module.exports = { sendMessageToSNS }
