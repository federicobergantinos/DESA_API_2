const { Favorite, Recipe, Media } = require("../entities/associateModels");
const BadRequest = require("../Errors/BadRequest");
const User = require("../entities/user");
const createFavorite = async (userId, recipeId) => {
  const favorite = await Favorite.findOne({ where: { userId, recipeId } });

  if (favorite !== null) {
    throw new BadRequest("Is liked");
  }

  return Favorite.create({
    userId: userId,
    recipeId: recipeId,
  });
};

const deleteFavorite = async (userId, recipeId) => {
  return Favorite.destroy({
    where: { userId, recipeId },
  });
};

const deleteFavoritesByRecipeId = async (recipeId) => {
  return Favorite.destroy({
    where: { recipeId },
  });
};


const isFavorite = async (userId, recipeId) => {
  const existingFavorite = await Favorite.findOne({
    where: { userId, recipeId },
  });
  return existingFavorite !== null;
};

const getFavorites = async (userId) => {
  try {
    const favoriteRecipeIds = await Favorite.findAll({
      where: { userId: userId },
      attributes: ["recipeId"],
    });
    const favoriteRecipes = await Promise.all(
      favoriteRecipeIds.map(async (favorite) => {
        // Consulta para obtener los datos de la receta y su Media asociada
        const recipeWithMedia = await Recipe.findOne({
          where: { id: favorite.recipeId },
          include: [
            { model: Media, as: "media", attributes: ["data"] }, // Incluye los datos de Media asociados a la receta
          ],
        });
        return recipeWithMedia.dataValues; // Retorna la receta con sus datos de Media
      })
    );
    const countFav = await Favorite.count({ where: { userId } });
    return { recipies: favoriteRecipes, total: countFav };
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    throw new BadRequest("Error al obtener favoritos");
  }
};

module.exports = { createFavorite, deleteFavorite, isFavorite, getFavorites, deleteFavoritesByRecipeId };
