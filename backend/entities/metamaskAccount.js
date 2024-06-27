const { DataTypes } = require('sequelize');
const sequelize = require('../configurations/database/sequelizeConnection');

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
  mnemonic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  privateKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = MetamaskAccount;
