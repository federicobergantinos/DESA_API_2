// backend/entities/metamaskAccount.js
const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const MetamaskAccount = sequelize.define('metamask_accounts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
})

module.exports = MetamaskAccount
