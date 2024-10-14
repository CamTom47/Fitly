const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');
const { query } = require('express');

// Common functions for Workout class
class Workout { 

    /**
     * Find all workouts
     * @returns {name, category, completed_count, favorited}
     */

    static async findAll(user_id, {category = undefined}) {
        console.log(category)
        let query = `
            SELECT id,
                    name,
                    category,
                    favorited
            FROM workouts`

             const whereExpressions = [];
             const queryValues = [];

        if(user_id !== undefined){
            queryValues.push(user_id);
            whereExpressions.push(`user_id = $${queryValues.length}`);
        }

        if(category !== undefined){
            queryValues.push(+category);
            whereExpressions.push(`category = $${queryValues.length}`);
        }

        if(whereExpressions.length){
            (whereExpressions.length === 1) ? query += "\n WHERE " + whereExpressions : query += "\n WHERE " + whereExpressions.join(" AND ");
        };
        console.log(query, queryValues)

        let result = await db.query(query, queryValues)

        let workouts = result.rows

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
            SELECT workouts.id,
                    name,
                    category,
                    favorited
            FROM workouts
            JOIN users_workouts 
            ON workouts.id = users_workouts.workout_id
            WHERE workouts.id = $1 AND users_workouts.user_id= $2`,
             [workout_id, user_id])

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
    static async add({name, category, favorited = false, user_id}) {
        const result = await db.query(`
            INSERT INTO workouts
            (name, user_id, category, favorited)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, user_id, category, favorited`, 
            [name, user_id, category, favorited]);


        const workout = result.rows[0];

        this.addUserWorkout(user_id, workout.id)

        return workout
            
            
    }

    static async addUserWorkout(user_id, workout_id){

        const result = await db.query(`
            INSERT INTO users_workouts
            (user_id, workout_id)
            VALUES ($1, $2)`,
        [user_id, workout_id])

        return result.rows[0]
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
                favorited: "favorited"
            }
        )

        const workoutIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE workouts
            SET ${ setCols }
            WHERE id = ${workoutIdVarIdx}
            RETURNING name, category, favorited`;

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
            WHERE id = $1
            RETURNING id`,
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