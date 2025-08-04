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

    static async findAll(user_id, filterBy = {}, sortBy = {}) {
        let query = `
            SELECT w.id,
                    w.name,
                    w.category,
                    w.favorited,
                    w.date_created AS "dateCreated",
                    w.times_completed AS "timesCompleted",
                    w.last_completed AS "lastCompleted"
            FROM workouts AS w
            LEFT JOIN categories AS c
            ON w.category = c.id`

             const whereExpressions = [];
             const whereValues = [];
             let orderExpression = null;

        if(user_id !== undefined){
            whereValues.push(user_id);
            whereExpressions.push(`w.user_id = $${whereValues.length}`);
        }

        if(filterBy.category !== undefined){
            whereValues.push(+filterBy.category);
            whereExpressions.push(`w.category = $${whereValues.length}`);
        }
        
        if(filterBy.favorited !== undefined){
            whereValues.push(true);
            whereExpressions.push(`w.favorited = $${whereValues.length}`);
        }
        if(sortBy.name !== undefined){
            if(sortBy.name === "nameAsc") orderExpression = `ORDER BY w.name ASC`
            else if (sortBy.name === "nameDesc") orderExpression = `ORDER BY w.name DESC`
        }
        if(sortBy.category !== undefined){
            if(sortBy.category === "categoryAsc") orderExpression = `ORDER BY c.name ASC`
            else if (sortBy.category === "categoryDesc") orderExpression = `ORDER BY c.name DESC`
        }
        if(sortBy.timesCompleted !== undefined){
            if(sortBy.timesCompleted === "timesCompletedAsc") orderExpression = `ORDER BY w.times_completed ASC`
            else if (sortBy.timesCompleted === "timesCompleteDesc") orderExpression = `ORDER BY w.times_completed DESC`
        }
        if(sortBy.lastCompleted !== undefined){
            if(sortBy.lastCompleted === "lastCompletedAsc") orderExpression = `ORDER BY w.last_completed ASC`
            else if (sortBy.lastCompleted === "lastCompletedDesc") orderExpression = `ORDER BY w.last_completed DESC`
        }

        if(whereExpressions.length){
            (whereExpressions.length === 1) ? query += "\n WHERE " + whereExpressions : query += "\n WHERE " + whereExpressions.join(" AND ");
        };

        if(orderExpression !== null) query += `\n ${orderExpression}`
        console.log(query, whereValues)

        let result = await db.query(query, whereValues)

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
                    date_created AS "dateCreated",
                    times_completed AS "timesCompleted",
                    last_completed AS "lastCompleted"
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
    static async add({name, category, favorited = false, user_id}, times_completed = 0) {
        const result = await db.query(`
            INSERT INTO workouts
            (name, user_id, category, favorited, times_completed)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, user_id, category, favorited, times_completed AS "timesCompleted"`, 
            [name, user_id, category, favorited, times_completed]);


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
                favorited: "favorited",
                timesCompleted: "times_completed",
                lastCompleted: "last_completed",
            }
        )

        const workoutIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE workouts
            SET ${ setCols }
            WHERE id = ${workoutIdVarIdx}
            RETURNING name, category, favorited, times_completed AS "timesCompleted", last_completed AS "lastCompleted"`;

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