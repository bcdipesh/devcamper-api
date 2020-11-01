"use strict";

const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

const { protect, authorize } = require("../middleware/auth");

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publishder", "admin"), createBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publishder", "admin"), bootcampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publishder", "admin"), updateBootcamp)
  .delete(protect, authorize("publishder", "admin"), deleteBootcamp);

module.exports = router;
