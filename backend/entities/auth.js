const { DataTypes } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");

const Authorization = sequelize.define("authorizations", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Authorization;
