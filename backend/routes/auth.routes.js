const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/Login", login);
router.post("/logout", logout);

module.exports = router;
