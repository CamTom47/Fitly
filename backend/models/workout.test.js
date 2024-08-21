const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Workout} = require('../models/workout');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testWorkoutId,
    testCategoryId
} = require('./_testCommon');
const { BCRYPT_WORK_FACTOR } = require('../config');

process.env.NODE_ENV = "test"

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", function(){
    test("works", async function() {
        let workouts = await Workout.findAll(testUserId[0]);

        expect(workouts).toEqual([{
            id: expect.any(Number),
            name: "Test Workout 1",
            category: testCategoryId[0],
            favorited: false
        }])
        
        
    })
})

describe("find", function(){
    test("works", async function() {
        let workout = await Workout.find(testWorkoutId[0], testUserId[0]);

        expect(workout).toEqual({
            id: expect.any(Number),
            name: "Test Workout 1",
            category: testCategoryId[0],
            favorited: false
        })
        
    })
})

describe("add", function() {
    test("works", async function(){
        let data = {
            name: "newWorkout",
            user_id: testUserId[0],
            category: testCategoryId[0],
            favorited: false,
        }

        let newWorkout = await Workout.add(data, testUserId[0]);

        expect(newWorkout).toEqual({
            id: expect.any(Number),
            name: "newWorkout",
            user_id: testUserId[0],
            category: testCategoryId[0],
            favorited: false,
        })
       
    })
})

describe("update", function(){
    test("works", async function(){
        let data = {
            name: "updatedWorkout"
        }

        let updatedWorkout = await Workout.update(testWorkoutId[0], data);

        expect(updatedWorkout).toEqual({
            name: "updatedWorkout",
            category: testCategoryId[0],
            favorited: false,
        })
       
    })
})

describe("delete", function(){
    test("works", async function(){

        let res = await db.query(`
            DELETE FROM workouts WHERE id = ${testWorkoutId[0]}`);

        expect(res.rows.length).toEqual(0);

    });
});