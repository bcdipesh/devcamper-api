"use strict";

const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @description Get Reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/bootcamps/:bootcampId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @description Get a single review
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getReivew = asyncHandler(async (req, res, next) => {
  const review = await (await Review.findById(req.params.id)).populated({
    path: "bootcamp",
    select: "name, description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});
