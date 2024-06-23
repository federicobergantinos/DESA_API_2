const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')
const User = require('./user')

const UserTokens = sequelize.define('user_tokens', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  tokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
})

module.exports = UserTokens
