"use strict";

/** Shared configuration for application; can be required many places */

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev"

const PORT = +process.env.PORT || 3001;

// Use database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.evn.NODE_ENV === "postgresql:///fitly_test")
    ? "fitly_test"
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
