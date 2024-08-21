const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError')

const { BCRYPT_WORK_FACTOR } = require('../config.js');
const e = require('express');

/** Related functions for category */

class Category {

    /**
     * Find and return all categories 
     * @returns { name }
     */

    static async findAll(user_id) {
        const result = await db.query(`
            SELECT id, user_id, name
            FROM categories
            WHERE systemDefault = $1 OR user_id = $2`, [true, user_id])

        let categories = result.rows;

        return categories;

    }

    /**
     * Find and return a category by name
     * @param {name} name 
     * @returns { name }
     */

    static async find(category_id) {
        const result = await db.query(`
            SELECT id, user_id, name
            FROM categories
            WHERE id = $1`,
        [category_id])
        
        let category = result.rows[0];

        return category;
    }

    /**
     * Add a new category to the application
     * 
     * @param {*} user_id 
     * @param {*} name 
     * @returns { category: {user_id, name}}
     */
    static async add({user_id, name}){
                
        const result = await db.query(`
            INSERT INTO categories
            (user_id, name, systemDefault)
            VALUES($1, $2, $3)
            RETURNING user_id, name`, [user_id, name, false]);

            const category = result.rows[0];

            return category
    }
    
    static async update(id, data){
        const category = await db.query(`
            SELECT user_id, name
            FROM categories
            WHERE id = $1`, [id]);

            if(!category) throw new NotFoundError(`Category not found: ${name}`);

            const { setCols, values } = sqlForPartialUpdate(data, 
                {
                    name: "name"
                }
            )
            
            const categoryVarIdx = ("$" + (values.length + 1));

            const querySql = `UPDATE categories
            SET ${setCols}
            WHERE id = ${categoryVarIdx}
            RETURNING name`;

            const result = await db.query(querySql, [...values, id]);

            const newCategory = result.rows[0];

            if(!newCategory) throw new NotFoundError(`Category not found: ${newCategory}`)

                return newCategory;
    }

    static async remove(id){
        const result = await db.query(`
            DELETE FROM categories
            WHERE id = $1`, [id]);
    }


}

module.exports = {Category};