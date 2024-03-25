const { DataTypes } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");

const Tags = sequelize.define("tags", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Tags;
