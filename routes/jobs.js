"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdminOrSelf, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const db = require("../db");


const router = express.Router();

router.get('/', async function(req, res, next){
    const jobs = await db.query(`SELECT * FROM jobs`);
    return res.json({jobs: jobs.rows});
})

module.exports = router;
