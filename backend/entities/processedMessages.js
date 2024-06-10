const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const ProcessedMessage = sequelize.define('ProcessedMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  queue_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  message_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('processed', 'error'),
    allowNull: false,
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  received_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'processed_messages',
  timestamps: false,
})

module.exports = ProcessedMessage
