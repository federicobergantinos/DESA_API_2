require('dotenv').config();
const AWS = require('aws-sdk');
const createLogger = require('../configurations/Logger');

const logger = createLogger(__filename);

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS();

const queueUrl = process.env.WALLET_QUEUE_URL;

const snsMessage = {
  Type: 'Notification',
  MessageId: '48ebe56d-9480-5f6e-bc42-bb9594ec4d28',
  TopicArn: 'arn:aws:sns:us-east-1:232171128702:CoreSNSTopic',
  Message: JSON.stringify({
    operationType: "CreateTransferCoreWallet",
    data: {
      accountNumber: "bf10e7be-9fdc-4c8b-9551-61609b8d431eb",
      date: "2024-06-27 20:12:20.6854745",
      amount: "715.28",
      transactionId: "7d680ee4-f6d8-4a9b-af64-304e861bcc1d",
      currency: "USD"
    }
  }),
  Timestamp: new Date().toISOString(),
  SignatureVersion: '1',
  Signature: 'EXAMPLESIGNATURE',
  SigningCertURL: 'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem',
  UnsubscribeURL: 'https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:232171128702:CoreSNSTopic:609c1459-83eb-4d11-ad15-d4a125e22bd2'
};

const params = {
  MessageBody: JSON.stringify(snsMessage),
  QueueUrl: queueUrl
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    logger.error("Error sending message to SQS:", err);
  } else {
    logger.info("Message sent to SQS:", data.MessageId);
  }
});
