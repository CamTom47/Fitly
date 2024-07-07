"use strict";

const db = require("../db");
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql')
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError')

const { BCRYPT_WORK_FACTOR } = require('../config.js')

/** Related functions for users */

class User {

    /** authenticate a user with username, password.
     * 
     * Returns { username, first_name, last_name, email, is_admin }
     * 
     * Throws UnauthorizedError if user is not found or password is wrong.
     * 
     */

    static async authenticate(username, password) {
        // try to find the user first

        const results = await db.query(
            `SELECT username,
                    password, 
                    first_name AS firstName,
                    last_name AS lastName,
                    email,
                    is_admin AS isAdmin

            FROM users
            WHERE username = $1
            `, [username]
        )

        const user = results.rows[0];
        

        if(user){

            // compare the hashed passowrd to the new hash from password
            const isValid = bcrypt.compare(password, user.password);
            if (isValid === true){
                delete user.password;
                return user;
            }
        }
            throw new NotFoundError('Invalid Username/Password')

    }

    /**
     * Register a user 
     * 
     * @param {*} username 
     * @param {*} password 
     * @param {*} first_name 
     * @param {*} last_name 
     * @param {*} email 
     * @param {*} is_admin 
     * @returns {username, first_name, last_name, email, is_admin}
     */

    static async register(username, password, first_name, last_name, email, is_admin = false) {


        //Check to ensure that the new username is not already taken

        const duplicateCheck =  await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`, [username])


        //Throw error if username already exists

        if(duplicateCheck.rows[0]){
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const results = await db.query(
            `INSERT INTO users
            (username, 
            password,
            first_name,
            last_name,
            email,
            is_admin)
            
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING (username, first_name AS "firstName, last_name AS "lastName", email, is_admin AS "isAdmin")`,
            [username, hashedPassword,first_name,last_name,email,is_admin]
        );

        const user = results.rows[0];

        return user;
    }


    /**
     * Update a users information with 'data'
     * 
     * @param {*} username 
     * @param {*} data
     * 
     * This can be a partial update, so it is okay if not all fields are contained in information.
     * 
     * Data can include:
     * { username, password, firstName, lastName, email, isAdmin }
     * 
     * 
     * @returns { username, firstName, lastName, isAdmin, email }
     * 
     * Throws NotFoundError if the user's username is not found
     */

    static async update(username, data){

        if(data.password){
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR)
        }

        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                username: "username",
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin",
                email: "email",
            }
        )

        const usernameVarIdx = ( "$" + (values.length + 1))

        const querySql = `UPDATE users
                            SET ${setCols}
                            WHERE username = ${usernameVarIdx}
                            RETURNINING username,
                                        first_name AS "firstName,
                                        last_name AS "lastName",
                                        email,
                                        is_admin AS "isAdmin"`;

        const result = await db.query(querySql, [...values, username]);

        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password
        return user;


    }

    /**
     * Delete a user from the database
     * 
     * @param {*} username 
     * 
     * Throw a NotFoundError if the username is not found.
     */
    
    static async remove(username) {
        let result = await db.query(`
            DELETE
            FROM users
            WHERE username = $1
            RETURNING username`,
        [username]);

        const user = result.rows[0];

        if(!user) throw new NotFoundError(`No User: ${username}`)
    }
}

module.exports = {User};