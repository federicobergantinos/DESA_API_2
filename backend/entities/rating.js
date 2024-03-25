const { DataTypes } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");

const Rating = sequelize.define("rating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Rating;
