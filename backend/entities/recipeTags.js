const { DataTypes } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");
const Recipe = require("./recipe");
const Tag = require("./tags");

const RecipeTags = sequelize.define("recipeTags", {
  recipeId: {
    type: DataTypes.INTEGER,
    references: {
      model: Recipe,
      key: "id",
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: "id",
    },
  },
});

module.exports = RecipeTags;
