const cron = require('node-cron')
const axios = require('axios')
const ExchangeRate = require('../entities/exchangeRate')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

// Función para obtener la cotización desde una API externa
const fetchExchangeRate = async () => {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD'
    )
    return response.data.rates.ARS // Suponiendo que la API devuelve un objeto con las tasas de cambio
  } catch (error) {
    logger.error('Error fetching exchange rate:', error)
    throw error
  }
}

// Función para actualizar la cotización en la base de datos
const updateExchangeRate = async () => {
  try {
    const rate = await fetchExchangeRate()

    // Actualiza la cotización en la base de datos
    await ExchangeRate.update({ rate }, { where: { currency: 'ARS' } })
    logger.info('Exchange rate updated successfully')
  } catch (error) {
    logger.error('Error updating exchange rate:', error)
  }
}

// Configurar el cron job para que se ejecute cada 30 minutos
cron.schedule('*/30 * * * *', () => {
  logger.info('Running scheduled job to update exchange rate')
  updateExchangeRate()
})

module.exports = {
  updateExchangeRate,
}
