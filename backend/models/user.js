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
    static async authenticate(username, password) {

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
            const isValid = bcrypt.compare(password, user.password);
            if (isValid === true){
                delete user.password;
                return user;
            }
        }
            throw new NotFoundError('Invalid Username/Password')

    }

    static async register(username, password, first_name, last_name, email, is_admin = false) {

        const duplicateCheck =  await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`, [username])

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