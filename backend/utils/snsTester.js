require('dotenv').config()
const AWS = require('aws-sdk')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' })

const sns = new AWS.SNS()
const topicArn = process.env.SNS_TOPIC_ARN

const payload = {
  operationType: 'CreateUser',
  data: {
    immovables: '1-2',
    hasTesla: 'no',
    employmentSituation: 'self-employed',
    monthlyIncome: '<1000',
    pictureSelfie:
      'https://wallet-desa-api-2.s3.amazonaws.com/rekognition/1718464904904_selfie.jpeg',
    pictureIdPassport:
      'https://wallet-desa-api-2.s3.amazonaws.com/rekognition/1718464906796_id_passport.jpeg',
    firstName: 'Federico',
    lastName: 'Bergantiños',
    email: 'asd@gmail.com',
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

sendMessageToSNS(payload)
