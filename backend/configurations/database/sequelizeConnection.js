const { Sequelize } = require('sequelize')
const createLogger = require('../Logger')
const logger = createLogger(__filename)

let sequelize

try {
  sequelize = new Sequelize({
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
    // Elimina las opciones de SSL
    dialectOptions:
      process.env.NODE_ENV === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  })

  // Prueba de conexión
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
} catch (error) {
  console.error('Error creating Sequelize instance', {
    message: error.message,
    stack: error.stack,
  })
  throw new Error('Error creating Sequelize instance')
}

module.exports = sequelize
