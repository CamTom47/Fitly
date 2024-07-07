const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError')

const { BCRYPT_WORK_FACTOR } = require('../config.js')

/** Related functions for category */

class Category {

    /**
     * Find and return all categories 
     * @returns { name, description }
     */

    static async findAll() {
        const result = await db.query(`
            SELECT name,
                    description
            FROM categories
            RETURNINING name, description`)

        let categories = result.rows;

        return categories;

    }

    /**
     * Find and return a category by name
     * @param {name} name 
     * @returns { name, description}
     */

    static async find(name) {
        const result = await db.query(`
            SELECT name,
                    description
            FROM categories
            WHERE name = $1
            RETURNINING name, description`,
        [name])

        let category = result.rows[0];

        return category;
    }

}

module.exports = {Category};