// Logger.js
const levels = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
}

// Fábrica que crea un logger con contexto (moduleName)
const createLogger = (moduleName) => ({
  log: (level, message) => {
    const timestamp = new Date().toISOString()
    if (Object.values(levels).includes(level)) {
      console.log(`${timestamp} [${moduleName}] ${level}: ${message}`)
    }
  },
  debug: (message) => {
    const timestamp = new Date().toISOString()
    console.log(`${timestamp} [${moduleName}] DEBUG: ${message}`)
  },
  info: (message) => {
    const timestamp = new Date().toISOString()
    console.log(`${timestamp} [${moduleName}] INFO: ${message}`)
  },
  warn: (message) => {
    const timestamp = new Date().toISOString()
    console.warn(`${timestamp} [${moduleName}] WARN: ${message}`)
  },
  error: (message) => {
    const timestamp = new Date().toISOString()
    console.error(`${timestamp} [${moduleName}] ERROR: ${message}`)
  },
  success: (message) => {
    const timestamp = new Date().toISOString()
    console.error(`${timestamp} [${moduleName}] SUCCESS: ${message}`)
  },
})

export default createLogger
