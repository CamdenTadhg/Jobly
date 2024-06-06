"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);


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
//19 change authorization to limit some things to logged-in users and some things to admins THURSDAY
  // create isAdminOrSelf middleware
  //add isAdmin middleware to creating, updating, and deleting companies
  // add isAdmin middleware to creating users and getting a list of all users
  // add isAdminOrSelf middleware to getting details, updating, or deleting a user
//18 look at table for jobs THURSDAY
//17 add a model for jobs THURSDAY
//16 write tests for the model THURSDAY
//15 add routes for jobs (same as companies, minus the filtering) THURSDAY
//14 write tests for the routs THURSDAY
//13 add filtering for jobs THURSDAY
//12 write comprehensive tests and documentation for filtering FRIDAY
//11 change companies get detail to list available jobs SATURDAY
//10 look at table for applications SATURDAY
//9 add method to user model allowing applications for job SATURDAY
//8 add post route to allow applications for jobs MONDAY
//7 change output for get user info so that it lists jobids the user has applied for TUESDAY
//6 write tests and documentation for jobs functionality TUESDAY

//5 add choosing random password functionality
//4 add enum type to application state functionality
//3 add technologies for jobs (table, model, display in appropriate places)
//2 add technologies for users (table, model, display in appropriate places)

//1 add functionality to require a secure password