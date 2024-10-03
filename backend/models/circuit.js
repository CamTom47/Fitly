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
     * 
     * Params: user_id 
     * 
     * @returns {sets, reps, weight, rest_period, intensity}
     */

    static async findAll(user_id) {
        const result = await db.query(`
            SELECT c.id,
                    sets,
                    reps,
                    weight,
                    rest_period AS "restPeriod",
                    intensity,
                    cw.workout_id AS "workoutId",
                    ce.exercise_id AS "exerciseId"
                    FROM circuits AS c
                    JOIN circuits_workouts AS cw
                    ON c.id= cw.circuit_id
                    JOIN workouts AS w
                    ON cw.workout_id = w.id
                    JOIN circuits_exercises AS ce
                    ON c.id = ce.circuit_id
                    WHERE w.user_id = $1`,
                    [user_id])

        let circuits = result.rows;

        return circuits;

    }


      /**
     * Get a circuit based on circuit_id
     * 
     * PARAMS: user_id, circuit_id
     * 
     * @returns {sets, reps, weight, rest_period, intensity}
     */

    static async find(user_id, circuit_id) {
        const result = await db.query(`
            SELECT  circuits.id,
                    circuits.sets,
                    circuits.reps,
                    circuits.weight,
                    circuits.rest_period AS "restPeriod",
                    circuits.intensity,
                    exercises.id AS "exerciseId",
            FROM circuits
            RIGHT JOIN circuits_exercises 
            ON circuits.id = circuits_exercises.circuit_id
            RIGHT JOIN exercises 
            ON circuits_exercises.exercise_id = exercises.id
            RIGHT JOIN users_exercises 
            ON exercises.id = users_exercises.exercise_id
            WHERE users_exercises.user_id = $1 AND circuits.id = $2`,
            [user_id,circuit_id])

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

    static async add({sets, reps, weight, rest_period, intensity}) {
        const result = await db.query(`
            INSERT INTO circuits
            (sets, reps, weight, rest_period, intensity)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, sets, reps, weight, rest_period, intensity`, 
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
        console.log(data)

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
            RETURNING id, sets, reps, weight, rest_period AS "restPeriod", intensity`;

        const result = await db.query(querySql, [...values, id]);
        const circuit = result.rows[0];

        if (!circuit) throw new NotFoundError(`Circuit not found: ${id}`)

        return circuit;
    };

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
    }

    static async addCircuitExercise(circuit_id, exercise_id){
        const result = await db.query(`
            INSERT INTO circuits_exercises
            (circuit_id, exercise_id)
            VALUES($1, $2)`,
        [circuit_id, exercise_id]);

        return result.rows[0];
    }
    
    static async updateCircuitExercise(circuit_id, exercise_id){
        const result = await db.query(`
            UPDATE circuits_exercises
            SET exercise_id = $1
            WHERE circuit_id = $2`,
        [exercise_id,circuit_id]);

        return result.rows[0];
    }
}

module.exports = {Circuit};