const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  getById,
  searchAll,
  update,
  deleteContact,
} = require("../controllers/contactController");

router.post("/create", create);
router.get("/", getAll);
router.get("/search", searchAll);
router.get("/:contactId", getById);
router.put("/:contactId", update);
router.get("/search", searchAll);
router.delete("/:contactId", deleteContact);

module.exports = router;
