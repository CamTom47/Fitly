const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

// Common functions for Workout class
class Workout { 

    /**
     * Find all workouts
     * @returns {name, category, completed_count, favorited}
     */

    static async findAll(user_id) {
        const result = await db.query(`
            SELECT name,
                    category,
                    completed_count, 
                    favorited
            FROM workouts
            WHERE user_id = $1
            RETURNINING (name,
                        category,
                        completed_count, 
                        favorited)`, [user_id] )

        let workouts = result.rows;

        return workouts;

    }

    /**
     * Find a workout based on workout_id
     * @param {*} workout_id 
     * @returns {name, user_id, category, completed_count, favorited}
     * 
     * Throw NotFoundError if workout_id is invalid
     */

    static async find(workout_id, user_id) {
        
        const result = await db.query(`
            SELECT name,
                    category,
                    completed_count, 
                    favorited
            FROM workouts
            WHERE id = $1
            RETURNINING (name,
                        category,
                        completed_count, 
                        favorited)` [workout_id])

        let workout = result.rows[0];

        if(!workout) throw new NotFoundError(`Workout not found; ${workout_id}`)

        return workout;
    }


    /**
     * Create a new workout
     * @param {*} name 
     * @param {*} user_id 
     * @param {*} category 
     * @param {*} completed_count 
     * @param {*} favorited 
     * @returns {name, user_id, category, completed_count, favorited}
     */
    static async add(name, user_id, category, completed_count = 0, favorited = false) {
        const result = await db.query(`
            INSERT INTO workouts
            (name, user_id, category, completed_count, favorited)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING(name, user_id, category, completed_count, favorited)`, 
            [name, user_id, category, completed_count, favorited]);


        const workout = result.rows[0];

        return workout
            
            
    }

    /**
     * Update an existing workout based on id
     * @param {*} id 
     * @param {*} data 
     * @returns {name, user_id, category, completed_count, favorited}
     * 
     * Throw NotFoundError if workout_id is invalid
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                name: "name",
                category : "category",
                completed_count: "completed_count", 
                favorited: "favorited"
            }
        )

        const workoutIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE workouts
            SET ${ setCols }
            WHERE id = ${workoutIdVarIdx}
            RETURNING(name, category, completed_count, favorited)`;

        const result = await db.query(querySql, [...values, id]);

        const workout = result.rows[0];

        if(!workout) throw new NotFoundError(`Workout not found: ${workout_id}`)

        return workout;


    }


    /**
     * Delete and existing workout based on workout_id
     * @param {*} workout_id 
     */
    
    static async remove(workout_id) {

        const result = await db.query(`
            DELETE FROM workouts
            WHERE id = $1`,
        [workout_id])

        const workout = result.rows[0];

        if(!workout) throw new NotFoundError(`Workout not found: ${workout_id}`)

    }

    static async addCircuit(workout_id, circuit_id){
        const result = await db.query(`
            INSERT INTO circuits_workouts (circuit_id, workout_id)
            VALUES($1, $2)
            RETURNING circuit_id, workout_id`,
        [circuit_id, workout_id])
        
        const workoutCircuit = result.rows[0];

        if(!workoutCircuit) throw new NotFoundError(`Incorrect Workout/Circuit: Workout ${workout_id} Circuit ${circuit_id}`)
            
        return workoutCircuit;
    }



}

module.exports = {Workout};