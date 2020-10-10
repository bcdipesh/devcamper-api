"use strict";

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Route files
const bootcamps = require("./routes/bootcamps");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Setup Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Setting up dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

// Start listening
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
