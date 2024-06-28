require('dotenv').config();
const AWS = require('aws-sdk');
const createLogger = require('../configurations/Logger');

const logger = createLogger(__filename);

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS();

const queueUrl = process.env.WALLET_QUEUE_URL;

const message = {
  operationType: "CreateTransferCoreWallet",
  data: {
    accountNumber: "bf10e7be-9fdc-4c8b-9551-61609b8d431eb",
    date: "2024-06-27 20:12:20.6854745",
    amount: "437.28",
    transactionId: "3d680ee4-f6d8-4a9b-af64-204e861bcc1d",
    currency: "USD"
  }
};

const params = {
  MessageBody: JSON.stringify(message),
  QueueUrl: queueUrl
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    logger.error("Error sending message to SQS:", err);
  } else {
    logger.info("Message sent to SQS:", data.MessageId);
  }
});
