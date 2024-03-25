const User = require("./user");
const Recipe = require("./recipe");
const Media = require("./media");
const Tag = require("./tags");
const Rating = require("./rating");
const Authorization = require("./auth");
const RecipeTags = require("./recipeTags");
const Favorite = require("./Favorite");

// Definiciones de relación existentes
Authorization.belongsTo(User, { as: "user", foreignKey: "userId" });
Recipe.hasMany(Media, { as: "media", foreignKey: "recipeId" });
Recipe.hasMany(Rating, {
  as: "rating",
  foreignKey: "recipeId",
});
Recipe.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Rating, { as: "rating", foreignKey: "userId" });

User.belongsToMany(Recipe, { through: Favorite, foreignKey: "userId" });
Recipe.belongsToMany(User, { through: Favorite, foreignKey: "recipeId" });

Recipe.belongsToMany(Tag, {
  through: RecipeTags,
  foreignKey: "recipeId",
  otherKey: "tagId",
});
Tag.belongsToMany(Recipe, {
  through: RecipeTags,
  foreignKey: "tagId",
  otherKey: "recipeId",
});

module.exports = {
  User,
  Recipe,
  Media,
  Tag,
  Rating,
  RecipeTags,
  Favorite,
};
