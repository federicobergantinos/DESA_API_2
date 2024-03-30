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

router.post("/create", create);
router.post("/uploadImage", upload.single("image"), uploadImage);
router.get("/", getAll);
router.get("/search", searchAll);
router.get("/:transactionId", getById);
router.put("/:transactionId", update);
router.delete("/:transactionId", deleteTransaction);

module.exports = router;
