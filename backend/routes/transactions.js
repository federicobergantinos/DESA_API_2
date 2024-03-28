const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  create,
  getAll,
  getById,
  searchAll,
  update,
  uploadImage,
  deleteTransaction,
} = require("../controllers/transactionController");
const { rate, getRate } = require("../controllers/ratingController");

router.post("/create", create);
router.post("/uploadImage", upload.single("image"), uploadImage);
router.get("/", getAll);
router.get("/search", searchAll);
router.get("/:recipeId", getById);
router.put("/:recipeId", update);
router.put("/:recipeId/ratings", rate);
router.get("/:recipeId/users/:userId/ratings", getRate);
router.delete("/:recipeId", deleteTransaction);

module.exports = router;
