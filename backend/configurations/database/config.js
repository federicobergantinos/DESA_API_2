const sequelize = require("../database/sequelizeConnection");
const {
  Favorite,
  User,
  Recipe,
  Media,
  Tag,
  Rating,
  RecipeTags,
} = require("../../entities/associateModels");
const {
  populateTags,
  populateRecipes,
  populateUser,
} = require("./initialData");

const dbConnection = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({});

    // Sincronizar modelos con la base de datos
    await User.sync();
    await Recipe.sync();
    await Media.sync();
    await Tag.sync();
    await Rating.sync();
    await RecipeTags.sync();

    // Poblar la base de datos con datos iniciales
    await populateTags();
    await populateUser();
    await populateRecipes();

    console.log("Database online");
  } catch (error) {
    console.error("There is an error starting database", error);
    throw new Error("There is an error starting database");
  }
};

module.exports = {
  dbConnection,
};
