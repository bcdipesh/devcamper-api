"use strict";

const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

const authController = {};

// @description Get all bootcamps
// @route       GET /api/v1/auth/register
// @access      Public
authController.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
});

module.exports = authController;
