const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class Circuit { 
    static async findAll() {
        const result = await db.query(`
            SELECT sets,
                    reps,
                    weight
                    rest_period,
                    intensity
            FROM circuits
            RETURNINING (sets,
                        reps,
                        weight,
                        rest_period,
                        intensity)`)

        let circuits = result.rows;

        return circuits;

    }

    static async find(circuit_id) {
        const result = await db.query(`
            SELECT sets,
                    reps,
                    weight
                    rest_period,
                    intensity
            FROM circuits
            WHERE id = $1
            RETURNINING (sets,
                        reps,
                        weight,
                        rest_period,
                        intensity)` [circuit_id])

        let circuit = result.rows[0];

        if(!circuit) throw new NotFoundError(`Circuit not found; ${circuit_id}`)

        return circuit;
    }

    static async add(sets, reps, weight, rest_period, intensity) {
        const result = await db.query(`
            INSERT INTO circuits
            (sets, reps, weight, rest_period, intensity)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING(sets, reps, weight, rest_period, intensity)`, 
            [sets, reps, weight, rest_period, intensity]);


        const circuit = result.rows[0];

        return circuit
            
            
    }

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                sets: "sets",
                reps : "reps",
                weight : "weight",
                rest_period : "rest_period",
                intensity : "intensity"
            }
        )

        const circuitIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE circuits
            SET ${ setCols }
            WHERE id = ${circuitIdVarIdx}
            RETURNING(sets, reps, weight, rest_period, intensity)`;

        const result = await db.query(querySql, [...values, id]);

        const circuit = result.rows[0];

        return circuit;


    }

    static async remove(circuit_id) {

        const result = await db.query(`
            DELETE FROM circuits
            WHERE id = $1`,
        [circuit_id])

        const circuit = result.rows[0];

        if(!circuit) throw new NotFoundError(`Circuit not found: ${circuit_id}`)

    }

}