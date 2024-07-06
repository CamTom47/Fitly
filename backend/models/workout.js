const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class Workout { 
    static async findAll() {
        const result = await db.query(`
            SELECT name,
                    category,
                    completed_count, 
                    favorited
            FROM workouts
            RETURNINING (name,
                        category,
                        completed_count, 
                        favorited)`)

        let workouts = result.rows;

        return workouts;

    }

    static async find(workout_id) {
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

        return workout;


    }

    static async remove(workout_id) {

        const result = await db.query(`
            DELETE FROM workouts
            WHERE id = $1`,
        [workout_id])

        const workout = result.rows[0];

        if(!workout) throw new NotFoundError(`Workout not found: ${workout_id}`)

    }

}