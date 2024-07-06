const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../ExpressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class Exercise { 
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

    static async add(name, muscle_group, equipment_id) {
        const result = await db.query(`
            INSERT INTO exercises
            (name, muscle_group, equipment_id)
            VALUES ($1, $2, $3)
            RETURNING(name, muscle_group, equipment_id)`, 
            [name, muscle_group, equipment_id]);


        const exercise = result.rows[0];

        return exercise
            
            
    }

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

        return exercise;


    }

    static async remove(exercise_id) {

        const result = await db.query(`
            DELETE FROM exercises
            WHERE id = $1`,
        [exercise_id])

        const exercise = result.rows[0];

        if(!exercise) throw new NotFoundError(`Exercise not found: ${exercise_id}`)

    }

}