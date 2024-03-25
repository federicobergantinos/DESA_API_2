const { DataTypes } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");

const Favorite = sequelize.define("favorites", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Favorite;
