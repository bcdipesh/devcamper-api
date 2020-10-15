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
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from the query
  const fieldsToExclude = ["select", "sort", "page", "limit"];

  // Loop over fieldsToExclude and delete them from reqQuery
  fieldsToExclude.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators like $gt, $gte, $lte, etc.,
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const bootcamp = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorHandler(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  bootcamp.remove();

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
