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
  debug: colors.fg.cyan + 'DEBUG' + colors.reset,
  info: colors.fg.green + 'INFO' + colors.reset,
  warn: colors.fg.yellow + 'WARN' + colors.reset,
  error: colors.fg.red + 'ERROR' + colors.reset,
  success: colors.fg.green + 'SUCCESS' + colors.reset,
}

const createLogger = (filePath) => {
  const moduleName = path.basename(filePath)

  const log = (level, message) => {
    const timestamp = new Date().toISOString()
    console.log(`${timestamp} [${moduleName}] ${level}: ${message}`)
  }

  return {
    log: (level, message) => {
      if (Object.values(levels).includes(level)) {
        log(level, message)
      }
    },
    debug: (message) => log(levels.debug, message),
    info: (message) => log(levels.info, message),
    warn: (message) => log(levels.warn, message),
    error: (message) => log(levels.error, message),
    success: (message) => log(levels.success, message),
  }
}

module.exports = createLogger
