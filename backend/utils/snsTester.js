require('dotenv').config()
const AWS = require('aws-sdk')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' })

const sns = new AWS.SNS()
const topicArn = 'arn:aws:sns:us-east-1:137318283310:wallet_topic'

const basePayload = {
  operationType: 'CreateUser',
  data: {
    immovables: '>2',
    hasTesla: 'yes',
    employmentSituation: 'employee',
    monthlyIncome: '>1000',
    pictureSelfie:
      'https://wallet-desa-api-2.s3.amazonaws.com/rekognition/1718672575975_selfie.jpeg',
    pictureIdPassport:
      'https://wallet-desa-api-2.s3.amazonaws.com/rekognition/1718672577434_id_passport.jpeg',
    firstName: 'Federico',
    lastName: 'Bergantiños',
    email: '',
  },
}

const sendMessageToSNS = async (messageBody) => {
  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(messageBody),
  }

  try {
    const data = await sns.publish(params).promise()
    logger.info(`Mensaje enviado a SNS: ${topicArn} ${data.MessageId}`)
  } catch (error) {
    logger.error(`Error enviando mensaje a SNS: ${error.message}`)
    throw error
  }
}

const generateEmail = (index) => `caso2023_${index}@gmail.com`

const startSendingMessages = () => {
  let counter = 0
  const interval = setInterval(async () => {
    if (counter >= 60) {
      // 60 iteraciones de 10 segundos son aproximadamente 10 minutos
      clearInterval(interval)
      logger.info('Finalizado el envío de mensajes.')
      return
    }

    const payload = {
      ...basePayload,
      data: { ...basePayload.data, email: generateEmail(counter) },
    }
    await sendMessageToSNS(payload)
    counter += 1
  }, 1000) // Enviar un mensaje cada 10 segundos
}

startSendingMessages()
