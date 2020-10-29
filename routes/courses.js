"use strict";

const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publishder", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publishder", "admin"), updateCourse)
  .delete(protect, authorize("publishder", "admin"), deleteCourse);

module.exports = router;
