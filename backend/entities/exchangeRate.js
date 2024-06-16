// backend/entities/exchangeRate.js
const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const ExchangeRate = sequelize.define('exchange_rates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
})

module.exports = ExchangeRate
