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

class Catgory {
    static async findAll() {
        const result = await db.query(`
            SELECT name,
                    description
            FROM categories
            RETURNINING name, description`)

        let categories = result.rows;

        return categories;

    }

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

    static async add(name, description) {
        const duplicateCheck = await db.query(`
            SELECT name
            FROM categories
            WHERE name = $1`, [name])

            if(duplicateCheck.rows[0]){
                throw new BadRequestError(`Duplicate category: ${name}`)
            }

            const result = await db.query(`
                INSERT INTO categories
                (name,
                description)
                VALUES ($1, $2)
                RETURNING name, description`)

            return result.rows[0];
    }

    static async update(name, data) {
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                name: "name",
                description: "description"
            }
        )

        const categoryNameVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE users
                            SET ${setCols}
                            WHERE name = ${categoryNameVarIdx}
                            RETURNING name, description`;


        const result = await db.query(querySql, [...values, name])

        const category = result.rows[0];

        if (!category) throw new NotFoundError(`No category: ${name}`)
            
            return category;
        }
        
        static async remove(name) {
            
            const result = await db.query(`
                DELETE from categories
                WHERE name = $1
                RETURNING name`, [name])
                
            const category = result.rows[0];
                
            if (!category) throw new NotFoundError(`No category: ${name}`)
                
    }

}