const { DataTypes } = require('sequelize');
const sequelize = require('../configurations/database/sequelizeConnection');

const Transaction = sequelize.define('transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  accountNumberOrigin: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'accountNumber',
    },
  },
  currencyOrigin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountNumberDestination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currencyDestination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Transaction;
