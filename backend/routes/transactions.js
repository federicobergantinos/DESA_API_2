const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  create,
  getAll,
  getById,
  uploadImage,
} = require("../controllers/transactionController");

router.post("/create", create);
router.post("/uploadImage", upload.single("image"), uploadImage); // TODO esto capaz hay que movelro a otro router
router.get("/", getAll);
router.get("/:transactionId", getById);

module.exports = router;
