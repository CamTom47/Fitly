const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class Equipment { 
    static async findAll() {
        const result = await db.query(`
            SELECT name
            FROM equipments
            RETURNINING (name)`)

        let equipments = result.rows;

        return equipments;

    }

    static async find(equipment_id) {
        const result = await db.query(`
            SELECT name
            FROM equipments
            WHERE id = $1
            RETURNINING (name)` [equipment_id])

        let equipment = result.rows[0];

        if(!equipment) throw new NotFoundError(`Equipment not found; ${equipment_id}`)

        return equipment;
    }

    static async add(name) {
        const result = await db.query(`
            INSERT INTO equipments
            (name)
            VALUES ($1)
            RETURNING(name)`, 
            [name]);


        const equipment = result.rows[0];

        return equipment
            
            
    }

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
            RETURNING(name)`;

        const result = await db.query(querySql, [...values, id]);

        const equipment = result.rows[0];

        return equipment;


    }

    static async remove(equipment_id) {

        const result = await db.query(`
            DELETE FROM equipments
            WHERE id = $1`,
        [equipment_id])

        const equipment = result.rows[0];

        if(!equipment) throw new NotFoundError(`equipment not found: ${equipment_id}`)

    }

}