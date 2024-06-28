const cron = require('node-cron');
const axios = require('axios');
const { Transaction } = require('../entities/associateModels'); // Asumiendo que ya tienes este modelo
const createLogger = require('../configurations/Logger');
const logger = createLogger(__filename);
const sequelize = require('../configurations/database/sequelizeConnection'); // Asumiendo que ya tienes esta conexión

// Función para obtener la cotización desde una API externa
const fetchExchangeRate = async () => {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD'
    );
    return response.data.rates.ARS; // Suponiendo que la API devuelve un objeto con las tasas de cambio
  } catch (error) {
    logger.error('Error fetching exchange rate:', error);
    throw error;
  }
};

// Función para actualizar la cotización en la base de datos
const updateExchangeRate = async () => {
  try {
    const rate = await fetchExchangeRate();

    // Actualiza la cotización en la base de datos
    await ExchangeRate.update({ rate }, { where: { currency: 'ARS' } });
    logger.info('Exchange rate updated successfully');
  } catch (error) {
    logger.error('Error updating exchange rate:', error);
  }
};

// Función para eliminar transacciones duplicadas
const removeDuplicateTransactions = async () => {
  try {
    const duplicates = await sequelize.query(`
      SELECT id
      FROM transactions
      WHERE description = 'Ingreso a la cuenta'
      AND "transactionId" IN (
        SELECT "transactionId"
        FROM transactions
        WHERE description = 'Ingreso a la cuenta'
        GROUP BY "transactionId"
        HAVING COUNT(*) > 1
      )
    `, {
      type: sequelize.QueryTypes.SELECT,
    });

    const duplicateIds = duplicates.map(dup => dup.id);

    if (duplicateIds.length > 0) {
      await sequelize.query(`
        DELETE FROM transactions
        WHERE id IN (
          SELECT id
          FROM (
            SELECT id,
                   ROW_NUMBER() OVER (PARTITION BY "transactionId" ORDER BY id) AS rnum
            FROM transactions
            WHERE "transactionId" IN (
              SELECT "transactionId"
              FROM transactions
              WHERE description = 'Ingreso a la cuenta'
              GROUP BY "transactionId"
              HAVING COUNT(*) > 1
            )
          ) t
          WHERE t.rnum > 1
        )
      `);

      logger.info(`Removed ${duplicateIds.length} duplicate transactions`);
    } else {
      logger.info('No duplicate transactions found');
    }
  } catch (error) {
    logger.error('Error removing duplicate transactions:', error);
  }
};

// Configurar el cron job para que se ejecute cada minuto
cron.schedule('* * * * *', () => {
  logger.info('Running scheduled job to remove duplicate transactions');
  removeDuplicateTransactions();
});

// Configurar el cron job para que se ejecute cada 30 minutos
cron.schedule('*/30 * * * *', () => {
  logger.info('Running scheduled job to update exchange rate');
  updateExchangeRate();
});

module.exports = {
  updateExchangeRate,
  removeDuplicateTransactions,
};
