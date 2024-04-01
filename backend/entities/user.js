const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
})

module.exports = User
