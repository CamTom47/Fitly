process.env.NODE_ENV === 'test';
const db = require('../db');
const app = require('../app');
const {SECRET_KEY} = require('../config')

const {User} = require('../models/user');
const {Exercise} = require('../models/exercise');
const {Workout} = require('../models/workout');
const {Circuit} = require('../models/circuit');
const {Equipment} = require('../models/equipment');
const {Category} = require('../models/category');
const {MuscleGroup} = require('../models/muscleGroup');
const { createToken } = require('../helpers/token');

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
    await db.query("DELETE FROM muscleGroups")
    await db.query("DELETE FROM users_workouts")
    await db.query("DELETE FROM users_exercises")
    await db.query("DELETE FROM circuits_workouts")
    await db.query("DELETE FROM circuits_exercises")
    await db.query("DELETE FROM users")

    
    
    let u1 = await User.register({
         username: "testUser1",
         password: 'testtest1',
         is_admin: false
     });

    let u2 = await User.register({
        username: "testUser2",
        password: 'testtest2',
        is_admin: false
    });
    
    let u3 = await User.register({
        username: "testUser3",
        password: 'testtest3',
        is_admin: false
    });
    
 
    testUserId.push(u1.id);
    testUserId.push(u2.id);
    testUserId.push(u3.id);

    const MuscleGroupRes = await db.query(`
        INSERT INTO muscleGroups(name)
        VALUES('Hamstrings')
        RETURNING id`);

    testMuscleGroupsId.splice(0,0, ...MuscleGroupRes.rows.map(e => e.id));
    

    await Exercise.add({
        name: "test exercise",
        muscle_group: testMuscleGroupsId[0]
    })

    await Exercise.add({
        name: "test exercise 2",
        muscle_group: testMuscleGroupsId[0]
    })

    // Category

    const categoryRes = await db.query(`
        INSERT INTO categories(user_id, name, systemDefault)
        VALUES( $1, 'HIIT', true),
        ( $1, 'Plyometrics', true)
        RETURNING id`, [testUserId[0]]);

    testCategoryId.splice(0,0, ...categoryRes.rows.map(c => c.id))  

    // Workout
    await Workout.add({
        name: "newWorkout",
        user_id: testUserId[0],
        category: testCategoryId[0],
        favorited: false,
    })
    // Circuit

    await Circuit.add({
        sets: 5,
        reps: 10,
        weight: 60,
        rest_period: 70,
        intensity: "low"
    })
    await Circuit.add({
        sets: 1,
        reps: 1,
        weight: 1,
        rest_period: 1,
        intensity: "low"
    })
    await Circuit.add({
        sets: 2,
        reps: 2,
        weight: 2,
        rest_period: 2,
        intensity: "low"
    })

    // Equipment

    await Equipment.add({
            user_id: testUserId[0],
            name:"test equipment",
            systemDefault: false
        })

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

const u1token = createToken({ username: "testUser1", isAdmin: false})
const u2token = createToken({ username: "testUser2", isAdmin: false})

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
    testCircuitId,
    testMuscleGroupsId,
    u1token,
    u2token
}