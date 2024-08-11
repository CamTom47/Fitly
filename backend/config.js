"use strict";

/** Shared configuration for application; can be required many places */

require('dotenv').config();
require('colors');

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev"

const PORT = +process.env.PORT || 3001;

// Use database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
    ? "postgresql:///fitly_test"
    : process.env.DATABASE_URL || "postgresql:///fitly"
}

//Speed up bcrypt during ests, since the algorithm safety isn't being tested

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;


module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
}
