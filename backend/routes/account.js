const express = require("express");
const router = express.Router();

const { create, getById } = require("../controllers/accountController");

router.post("/create", create);
router.get("/:userId", getById);

module.exports = router;
