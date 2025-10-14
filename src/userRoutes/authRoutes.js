const express = require("express");
const router = express.Router();
const { signup, login, saveProfile } = require("../useController/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/save-profile", saveProfile);

module.exports = router;
