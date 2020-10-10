"use strict";
const bootcampController = {};

// @description Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
bootcampController.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps",
  });
};

// @description Get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      Public
bootcampController.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show bootcamp ${req.params.id}`,
  });
};

// @description Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
bootcampController.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Create bootcamp",
  });
};

// @description Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
bootcampController.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update bootcamp ${req.params.id}`,
  });
};

// @description Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
bootcampController.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete bootcamp ${req.params.id}`,
  });
};

module.exports = bootcampController;
