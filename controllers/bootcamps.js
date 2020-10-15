"use strict";

const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

const bootcampController = {};

// @description Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
bootcampController.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

// @description Get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      Public
bootcampController.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorHandler(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @description Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
bootcampController.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @description Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
bootcampController.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    next(
      new ErrorHandler(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @description Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
bootcampController.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorHandler(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @description Get bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
bootcampController.getBootcampsInRadius = asyncHandler(
  async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = distance / 3,963 mi or distance / 6,378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  }
);
module.exports = bootcampController;
