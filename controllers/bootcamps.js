"use strict";

const path = require("path");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

const bootcampController = {};

// @description Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
bootcampController.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @description Get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      Public
bootcampController.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
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
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({
    user: req.user.id,
  });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with the ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorHandler(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        404
      )
    );
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
    return next(
      new ErrorHandler(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        `User ${req.user.id} is not authorized to delete this bootcamp`,
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

// @description Upload photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
bootcampController.bootcampPhotoUpload = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorHandler(
          `Bootcamp not found with the id of ${req.params.id}`,
          404
        )
      );
    }

    if (!req.files) {
      return next(new ErrorHandler("Please upload a file", 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!req.files.mimetype.startsWith("image")) {
      return next(new ErrorHandler("Please upload an image file", 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
      return next(
        new ErrorHandler(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD_SIZE}`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorHandler("Problem with file upload", 500));
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, {
        photo: file.name,
      });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  }
);

module.exports = bootcampController;
