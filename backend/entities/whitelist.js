const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const Whitelist = sequelize.define('whitelist', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
})

module.exports = Whitelist
