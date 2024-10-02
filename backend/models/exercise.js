const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');


//Common functions for Exercise class

class Exercise { 

    /**
     * Find all exercises
     * @returns {name, muscle_group, equipment_id}
     */

    static async findAll(user_id) {
        let query = `
            SELECT  exercises.id,
                    exercises.name,
                    exercises.muscle_group AS muscleGroup,
                    exercises_equipments.equipment_id AS equipmentId
            FROM exercises
            JOIN users_exercises
            ON exercises.id = users_exercises.exercise_id
            JOIN exercises_equipments
            ON exercises.id = exercises_equipments.exercise_id`

        const whereExpressions = [];
        const queryValues = [];

        if(user_id !== undefined){
            queryValues.push(user_id)
            whereExpressions.push(`users_exercises.user_id = $${queryValues.length}`)
        }

        if(whereExpressions.length){
            (whereExpressions.length === 1 ) ? query += "\n WHERE " + whereExpressions : query += " WHERE " + whereExpressions.join(" AND ");
        };

        let result = await db.query(query, queryValues)

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
    
    static async find(user_id, exercise_id) {
        const result = await db.query(`
            SELECT  exercises.id,
                    exercises.name,
                    exercises.muscle_group AS muscleGroup,
                    exercises_equipments.equipment_id AS equipmentId
            FROM exercises
            JOIN users_exercises 
            ON exercises.id = users_exercises.exercise_id
            JOIN exercises_equipments
            ON exercises.id = exercises_equipments.exercise_id
            WHERE exercises.id = $1 AND users_exercises.user_id = $2`,
            [exercise_id, user_id])

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

    static async add({name, muscle_group}) {
        const result = await db.query(`
            INSERT INTO exercises
            (name, muscle_group)
            VALUES ($1, $2)
            RETURNING id, name, muscle_group`, 
            [name, muscle_group]);

            const exercise = result.rows[0];
            
        return exercise  
    }

    static async addExerciseEquipment(exercise_id, equipment_id){

        const result = await db.query(`
            INSERT INTO exercises_equipments
            (exercise_id, equipment_id)
            VALUES($1, $2)
            RETURNING exercise_id, equipment_id`, 
        [exercise_id, equipment_id]);
        
        return result.rows[0];
    }

    /**
     * Adds exercise and user to users_exercises table.
     * @param {*} user_id 
     * @param {*} exercise_id 
     */

    static async addUserExercise(user_id, exercise_id){
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
    
    static async update(id, data, equipment_id) {
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                name: "name",
                muscle_group : "muscle_group",
            }
        )

        const exerciseIdVarIdx = ("$" + (values.length + 1));

        const querySql = `UPDATE exercises
            SET ${ setCols }
            WHERE id = ${exerciseIdVarIdx}
            RETURNING id, name, muscle_group`;

        const result = await db.query(querySql, [...values, id]);

        const exercise = result.rows[0];

        if(!exercise) throw new NotFoundError(`Exercise not found: ${exercise_id}`)

        //Update Many-to-many table of equipment/exercise

        await db.query(`
            UPDATE exercises_equipments
            SET equipment_id = $1
            WHERE exercise_id = $2`, [equipment_id, id]);

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
    }

}

module.exports = {Exercise};