const express = require("express");
const router = express.Router();

const {
  createFav,
  deleteFav,
  getFav,
  getUser,
  editProfile,
} = require("../controllers/userController");

router.get("/:userId", getUser);
router.put("/:userId", editProfile);

module.exports = router;
