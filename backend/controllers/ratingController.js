const {rateRecipe, getUserRating} = require("../services/ratingService");
const rate = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const {value, userId } = req.body;
        const result = await rateRecipe(userId, recipeId, value)
        res.status(201).json({
            recipeRating: result
        });
    } catch (error) {
        console.error(` ${error}`);
        res.status(error.code || 500).json({
            msg: error.message || "An exception has ocurred",
        });
    }
};

const getRate = async (req, res) => {
    try {
        const { recipeId, userId } = req.params;
        const recipeRating = await getUserRating(recipeId, userId)
        res.status(200).json(recipeRating);
    } catch (error) {
        console.error(` ${error}`);
        res.status(error.code || 500).json({
            msg: error.message || "An exception has ocurred",
        });
    }
};

module.exports = {
    rate, getRate
};
