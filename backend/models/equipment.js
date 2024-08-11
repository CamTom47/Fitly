const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');


//Common functions for Eqipment clas

class Equipment { 

    /**
     * Find all equipment 
     * PARAMS: user_id
     * @returns {name}
     */

    static async findAll(user_id) {
        const result = await db.query(`
            SELECT id, name
            FROM equipments
            WHERE user_id = $1 OR systemDefault = $2`,
        [user_id, true])

        let equipments = result.rows;

        return equipments;

    }

    /**
     * Find a piece of equipment based on equipment_id
     * @param {*} equipment_id , user_id
     * @returns name
     */

    static async find(equipment_id, user_id) {
        
        const result = await db.query(`
            SELECT id, name
            FROM equipments
            WHERE id = $1 AND (user_id = $2 OR systemDefault = true) `, [equipment_id, user_id])

        let equipment = result.rows[0];

        if(!equipment) throw new NotFoundError(`Equipment not found; ${equipment_id}`)

        return equipment;
    }

    /**
     * Add a piece of equipment
     * @param {*} name 
     * @returns {name}
     */

    static async add({user_id, name}) {
        const result = await db.query(`
            INSERT INTO equipments
            (user_id, name, systemDefault)
            VALUES ($1, $2, $3)
            RETURNING id, name`, 
            [user_id, name, false]);


        const equipment = result.rows[0];

        return equipment
            
            
    }

    /**
     * Update a piece of equipment based on equipment_id
     * @param {*} id 
     * @param {*} data 
     * @returns {name}
     * 
     * Throws a NotFoundError if the equipment_id is invalid
     */
    
    
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                name: "name"
            }
        )

        const equipmentIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE equipments
            SET ${ setCols }
            WHERE id = ${equipmentIdVarIdx}
            RETURNING id, name`;

        const result = await db.query(querySql, [...values, id]);

        const equipment = result.rows[0];

        if(!equipment) throw new NotFoundError(`Equipment not found: ${id}`)

        return equipment;


    }

    /**
     * Remove a piece of equipment based on equipment_id
     * @param {*} equipment_id 
     * @returns {name}
     * 
     * Throws a NotFoundError if the equipment_id is invalid
     */

    static async remove(equipment_id) {

        const result = await db.query(`
            DELETE FROM equipments
            WHERE id = $1`,
        [equipment_id])

        const equipment = result.rows[0];

        if(!equipment) throw new NotFoundError(`Equipment not found: ${equipment_id}`)

    }

}

module.exports = {Equipment};