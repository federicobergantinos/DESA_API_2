const {
  createFavorite,
  deleteFavorite,
  getFavorites,
} = require("../services/favoriteService");
const { updateUserProfile, findUserById } = require("../services/userService");

const createFav = async (req, res) => {
  try {
    const { userId } = req.params;
    const recipeId = req.body.recipeId;
    const favorite = await createFavorite(userId, recipeId);
    if (favorite) {
      res.status(204).send("");
    } else {
      res.status(500).send("");
    }
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has ocurred",
    });
  }
};

const deleteFav = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const favoriteDeleted = await deleteFavorite(userId, recipeId);

    if (favoriteDeleted) {
      res.status(204).send("");
    } else {
      res.status(500).send("");
    }
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has ocurred",
    });
  }
};

const getFav = async (req, res) => {
  try {
    // const countFav = await Favorite.count({ where: { userId } });
    const favorite = await getFavorites(req.params.userId);
    res
      .status(200)
      .json({ favorites: favorite.recipies, total: favorite.total });
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has ocurred",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.error(`${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has ocurred",
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = {};
    // Recoger solo los campos que necesitamos actualizar
    const { name, surname, photoUrl } = req.body;
    if (name !== undefined) updateData.name = name;
    if (surname !== undefined) updateData.surname = surname;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

    const updatedUser = await updateUserProfile(userId, updateData);
    if (updatedUser) {
      res.status(200).json({ user: updatedUser });
    } else {
      // Este bloque else podría no ser necesario dado que ahora lanzamos un error si el usuario no se encuentra
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An exception has occurred",
    });
  }
};

module.exports = {
  createFav,
  deleteFav,
  getFav,
  getUser,
  editProfile,
};
