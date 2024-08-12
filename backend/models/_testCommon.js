process.env.NODE_ENV === 'test'


const bcrypt = require('bcrypt')
const db = require('../db')

const User = require('../models/user')
const Circuit = require('../models/circuit')
const Exercise = require('../models/exercise')
const Workout = require('../models/workout')
const Category = require('../models/category')
const Equipment = require('../models/equipment')

const { BCRYP_WORK_FACTOR } = require('../config')

let testUserId = [];
let testEquipmentId = [];
let testCategoryId = [];
let testExerciseId = [];
let testWorkoutId = [];
let testCircuitId = [];
let testMuscleGroupsId = [];

async function commonBeforeAll(){

    await db.query("DELETE FROM circuits")
    await db.query("DELETE FROM exercises")
    await db.query("DELETE FROM workouts")
    await db.query("DELETE FROM categories")
    await db.query("DELETE FROM equipments")
    await db.query("DELETE FROM users_workouts")
    await db.query("DELETE FROM users_exercises")
    await db.query("DELETE FROM circuits_workouts")
    await db.query("DELETE FROM circuits_exercises")
    await db.query("DELETE FROM users")

    const resultUser = await db.query(`
        INSERT INTO users(username, first_name, last_name, password, email, is_admin)
        VALUES ('testUser', 'testF', 'testL', 'testtest', 'test@test.com', 'true')
        RETURNING id`);

        testUserId.splice(0,0, ...resultUser.rows.map(u => u.id));

    const resultEquipment = await db.query(`
                INSERT INTO equipments(user_id, name, systemDefault)
                VALUES($1, 'Kettle Bells', true)
                RETURNING id`, [testUserId[0]]);

        testEquipmentId.splice(0,0, ...resultEquipment.rows.map(e => e.id))
    
    const resultCategory = await db.query(`
            INSERT INTO categories(user_id, name, systemDefault)
            VALUES( $1, 'HIIT', true),
            ( $1, 'Plyometrics', true)
            RETURNING id`, [testUserId[0]]);

        testCategoryId.splice(0,0, ...resultCategory.rows.map(c => c.id))           
    
            
    const resultMuscleGroup = await db.query(`
            INSERT INTO muscleGroups(name)
            VALUES('Hamstrings')
            RETURNING id`);

        testMuscleGroupsId.splice(0,0, ...resultMuscleGroup.rows.map(e => e.id));
        
    const resultExercise = await db.query(`
            INSERT INTO exercises(name, muscle_group)
            VALUES('Kettle Bell Squats', 1)
            RETURNING id`);

        testExerciseId.splice(0,0, ...resultExercise.rows.map(e => e.id))
        
        const resultWorkout = await db.query(`
            INSERT INTO workouts(user_id, name, category, favorited)
            VALUES($1, 'Test Workout 1', $2, false)
            RETURNING id`, [testUserId[0], testCategoryId[0]]);
            testWorkoutId.splice(0,0, ...resultWorkout.rows.map(w => w.id))
        
        const resultCircuit = await db.query(`
            INSERT INTO circuits(sets, reps, weight, rest_period, intensity)
            VALUES(5, 10, 100, 60, 'medium')
            RETURNING id`);
            testCircuitId.splice(0,0, ...resultCircuit.rows.map(c=> c.id))

            await db.query(`
            INSERT INTO users_workouts(user_id, workout_id)
            VALUES($1, $2)`, [testUserId[0],testWorkoutId[0]]);

            await db.query(`
            INSERT INTO users_exercises(user_id, exercise_id)
            VALUES($1, $2)`, [testUserId[0],testExerciseId[0]]);

            await db.query(`
            INSERT INTO circuits_workouts(circuit_id, workout_id)
            VALUES($1, $2)`, [testCircuitId[0],testWorkoutId[0]]);

            await db.query(`
            INSERT INTO circuits_exercises(circuit_id, exercise_id)
            VALUES($1, $2)`, [testCircuitId[0],testExerciseId[0]]);

            await db.query(`
            INSERT INTO exercises_equipments(exercise_id, equipment_id)
            VALUES($1, $2)`, [testExerciseId[0],testEquipmentId[0]]);        

}

async function commonBeforeEach(){
    await db.query("BEGIN")
    
}

async function commonAfterEach(){
    await db.query("ROLLBACK")    
}

async function commonAfterAll(){
    await db.end();
}

module.exports = {
    commonBeforeAll,
    commonAfterAll,
    commonBeforeEach,
    commonAfterEach,
    testUserId,
    testCategoryId,
    testEquipmentId,
    testExerciseId,
    testWorkoutId,
    testCircuitId
}