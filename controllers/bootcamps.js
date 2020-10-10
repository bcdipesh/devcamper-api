"use strict";

const Bootcamp = require("../models/Bootcamp");

const bootcampController = {};

// @description Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
bootcampController.getBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.find();

    res.status(200).json({
      success: true,
      count: bootcamp.length,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @description Get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      Public
bootcampController.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @description Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
bootcampController.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @description Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
bootcampController.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({
        success: true,
      });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @description Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
bootcampController.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({
        success: true,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = bootcampController;
