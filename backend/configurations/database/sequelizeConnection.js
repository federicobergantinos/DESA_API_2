/*const { Sequelize } = require('sequelize')
const createLogger = require('../Logger')
const logger = createLogger(__filename)

let sequelize

try {
  console.log(process.env.POSTGRES_PASSWORD);

  sequelize = new Sequelize({
    database: "daidb",
    username: "postgres",
    password: "base1234",
    host: localhost,
    port: 5432,
    dialect: 'postgres',
    logging: false,
    // Elimina las opciones de SSL
    dialectOptions:
      'production' === 'production'
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
  logger.error('Error creating Sequelize instance', {
    message: error.message,
    stack: error.stack,
  })
  throw new Error('Error creating Sequelize instance')
}

module.exports = sequelize*/
const { Sequelize } = require('sequelize');
const createLogger = require('../Logger');
const logger = createLogger(__filename);

let sequelize;

try {
  // Uncomment the next line only for debugging in a safe environment
  // console.log(process.env.POSTGRES_PASSWORD);

  sequelize = new Sequelize({
    database: "daidb",
    username: "postgres",
    password: "base1234",
    host: "localhost",
    port: 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  });

  // Test connection
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
} catch (error) {
  logger.error('Error creating Sequelize instance', {
    message: error.message,
    stack: error.stack,
  });
  throw new Error('Error creating Sequelize instance');
}

module.exports = sequelize;

