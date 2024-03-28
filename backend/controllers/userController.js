const { updateUserProfile, findUserById } = require("../services/userService");

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
  getUser,
  editProfile,
};
