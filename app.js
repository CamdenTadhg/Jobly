"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;


//USE TEST-DRIVEN DEVELOPMENT
//11 add routes for jobs (same as companies) THURSDAY
//10 change companies get detail to list available jobs FRIDAY
//9 look at table for applications FRIDAY
//8 write tests and documentation for applications functionality SATURDAY
//7 add method to user model allowing applications for job SATURDAY
//6 add post route to allow applications for jobs MONDAY
//5 change output for get user info so that it lists jobids the user has applied for TUESDAY

//4 add choosing random password functionality
//3 add enum type to application state functionality
//2 add technologies for jobs (table, model, display in appropriate places)
//1 add technologies for users (table, model, display in appropriate places)