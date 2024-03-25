const express = require("express");
const router = express.Router();

const {
    authenticate,
    refresh,
    deleteCredential,
} = require("../controllers/auth");

router.post("/", authenticate);
router.put('/',refresh);
router.delete('/',deleteCredential);

module.exports = router;