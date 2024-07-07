const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');


//Related functions for the Circuit class
class Circuit { 

    /**
     * Get all circuits 
     * @returns {sets, reps, weight, rest_period, intensity}
     */

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


      /**
     * Get a circuit based on circuit_id
     * @returns {sets, reps, weight, rest_period, intensity}
     */

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

    /**
     * Create a new circuit
     * @param {*} sets 
     * @param {*} reps 
     * @param {*} weight 
     * @param {*} rest_period 
     * @param {*} intensity 
     * @returns {sets, reps, weight, rest_period, intensity}
     */

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

    /**
     * Update an existing circuit
     * @param {*} id 
     * @param {*} data 
     * @returns {sets, reps, weight, rest_period, intensity}
     * 
     * Throw NotFoundError if ciruit_id is invalid.
     */

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

        if (!circuit) throw new NotFoundError(`Circuit not found: ${id}`)

        return circuit;



    }

    /**
     * Remove a ciruit based on circuit_id
     * @param {*} circuit_id 
     * 
     * Throw NotFoundError if the circuit_id is invalid
     */
    
    static async remove(circuit_id) {

        const result = await db.query(`
            DELETE FROM circuits
            WHERE id = $1`,
        [circuit_id])

        const circuit = result.rows[0];

        if(!circuit) throw new NotFoundError(`Circuit not found: ${circuit_id}`)

    }

    static async addCircuitExercise(circuit_id, exercise_id){
        const result = await db.query(`
            INSERT INTO circuits_exercises
            (circuit_id, exercise_id)
            VALUES($1, $2)`,
        [circuit_id, exercise_id])

        return result.rows[0];
    }
}

module.exports = {Circuit};