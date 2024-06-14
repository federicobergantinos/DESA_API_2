const path = require('path')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },

  bg: {
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  },
}

const levels = {
  debug: { label: colors.fg.cyan + 'DEBUG' + colors.reset, rank: 1 },
  info: { label: colors.fg.green + 'INFO' + colors.reset, rank: 2 },
  warn: { label: colors.fg.yellow + 'WARN' + colors.reset, rank: 3 },
  error: { label: colors.fg.red + 'ERROR' + colors.reset, rank: 4 },
  success: { label: colors.fg.green + 'SUCCESS' + colors.reset, rank: 5 },
}

const createLogger = (filePath) => {
  const moduleName = path.basename(filePath)
  const logLevel = process.env.LOG_LEVEL || 'debug'
  const currentLogLevelRank = levels[logLevel].rank

  const log = (level, message) => {
    if (levels[level].rank >= currentLogLevelRank) {
      const timestamp = new Date().toISOString()
      console.log(
        `${timestamp} [${moduleName}] ${levels[level].label}: ${message}`
      )
    }
  }

  return {
    log: (level, message) => {
      if (levels[level]) {
        log(level, message)
      }
    },
    debug: (message) => log('debug', message),
    info: (message) => log('info', message),
    warn: (message) => log('warn', message),
    error: (message) => log('error', message),
    success: (message) => log('success', message),
  }
}

module.exports = createLogger
