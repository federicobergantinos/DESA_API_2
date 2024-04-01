const { DataTypes } = require('sequelize')
const sequelize = require('../configurations/database/sequelizeConnection')

const Media = sequelize.define('media', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
})

module.exports = Media
