"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// let DB_URI = getDatabaseUri();

let db = new Client({
  connectionString: getDatabaseUri()
})

db.connect();

module.exports = db;