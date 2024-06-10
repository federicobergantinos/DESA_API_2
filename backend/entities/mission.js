const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const Mission = sequelize.define('missions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reward: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  claimed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
})

module.exports = Mission
