"use strict";

const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/forgotPassword", forgotPassword);

module.exports = router;
