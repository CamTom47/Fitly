const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');
const Equipment = require('./equipment.js');


//Common functions for Exercise class

class Exercise { 

    /**
     * Find all exercises
     * @returns {name, muscle_group, equipment_id}
     */

    static async findAll() {
        const result = await db.query(`
            SELECT name,
                    muscle_group,
                    equipment_id
            FROM exercises
            RETURNINING (name,
                        muscle_group,
                        equipment_id)`)

        let exercises = result.rows;

        return exercises;

    }

      /**
     * Find an exercises based on exercise_id
     * @param {*} exercise_id 
     * @returns {name, muscle_group, equipment_id}
     * 
     * Throw NotFoundError if exercise_id is invalid.
     */
    
    static async find(exercise_id) {
        const result = await db.query(`
            SELECT name,
                    muscle_group,
                    equipment_id
            FROM exercises
            WHERE id = $1
            RETURNINING (name,
                        muscle_group,
                        equipment_id)` [exercise_id])

        let exercise = result.rows[0];

        if(!exercise) throw new NotFoundError(`Exercise not found; ${exercise_id}`)

        return exercise;
    }


    /**
     * Create a new exercise 
     * @param {*} name 
     * @param {*} muscle_group 
     * @param {*} equipment_id 
     * @returns {name, muscle_group, equipment_id}
     */

    static async add(name, muscle_group, equipment_id, user_id) {
        const result = await db.query(`
            INSERT INTO exercises
            (name, muscle_group, equipment_id)
            VALUES ($1, $2, $3)
            RETURNING(name, muscle_group, equipment_id)`, 
            [name, muscle_group, equipment_id]);

            
            
            const exercise = result.rows[0];
            
            this.addExercise(user_id, exercise.id)
            
        return exercise
            
            
    }

    /**
     * Adds exercise and user to users_exercises table.
     * @param {*} user_id 
     * @param {*} exercise_id 
     */

    static async addExercise(user_id, exercise_id){
        const result = await db.query(`
            INSERT INTO users_exercises
            (user_id, exercise_id)
            VALUES($1, $2)`,
        [user_id, exercise_id])

        return result.rows[0];
    }


    /**
     * Update an existing exercise based on id
     * @param {*} id 
     * @param {*} data 
     * @returns {name, muscle_group, exercise_id}
     * 
     * Throws NotFoundError if id is invalid
     */
    
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                name: "name",
                muscle_group : "muscle_group",
                equipment_id : "equipment_id"
            }
        )

        const exerciseIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE exercises
            SET ${ setCols }
            WHERE id = ${exerciseIdVarIdx}
            RETURNING(name, muscle_group, equipment_id)`;

        const result = await db.query(querySql, [...values, id]);

        const exercise = result.rows[0];

        if(!exercise) throw new NotFoundError(`Exercise not found: ${exercise_id}`)

        return exercise;


    }

    /**
     * Removes an existing exercise based on exercise_id
     * @param {*} exercise_id 
     * 
     * Throws NotFoundError if exercise_id is invalid
     */

    static async remove(exercise_id) {

        const result = await db.query(`
            DELETE FROM exercises
            WHERE id = $1`,
        [exercise_id])

        const exercise = result.rows[0];

        if(!exercise) throw new NotFoundError(`Exercise not found: ${exercise_id}`)

    }

}

module.exports = {Exercise};