// backend/middleware/logger.js

const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const requestLogger = (req, res, next) => {
  logger.info(`Request: ${req.method} ${req.originalUrl}`)
  logger.info(`Request Body: ${JSON.stringify(req.body)}`)

  const oldWrite = res.write
  const oldEnd = res.end

  const chunks = []

  res.write = function (chunk) {
    chunks.push(chunk)
    return oldWrite.apply(res, arguments)
  }

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks).toString('utf8')
    logger.info(`Response: ${res.statusCode} ${body}`)
    oldEnd.apply(res, arguments)
  }

  next()
}

module.exports = requestLogger
