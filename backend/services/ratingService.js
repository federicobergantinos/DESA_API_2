const { Rating } = require("../entities/associateModels");
const BadRequest = require("../Errors/BadRequest");
const { getRecipes } = require("./transactionService");

const rateRecipe = async (userId, recipeId, value) => {
  const [ratingInstance, created] = await Rating.findOrCreate({
    where: { userId: userId, recipeId: recipeId },
    defaults: { value: value },
  });
  if (!created) {
    await ratingInstance.update({ value: value });
  }

  const newRating = await getRecipeRating(recipeId);
  return newRating;
};

const getUserRating = async (recipeId, userId) => {
  const userRating = await Rating.findOne({
    where: { userId: userId, recipeId: recipeId },
    attributes: ["value"],
  });

  return { userRating: userRating !== null ? userRating.dataValues.value : 0 };
};

const getRecipeRating = async (recipeId) => {
  const ratings = await Rating.findAll({
    where: { recipeId: recipeId },
    attributes: ["value"],
  });
  let ratingSum = 0;
  ratings.forEach((it) => {
    ratingSum = ratingSum + it.dataValues.value;
  });
  return ratingSum / ratings.length || 0;
};

const deleteRatingByRecipeId = async (recipeId) => {
  return Rating.destroy({
    where: { recipeId },
  });
};

module.exports = {
  rateRecipe,
  getUserRating,
  getRecipeRating,
  deleteRatingByRecipeId,
};
