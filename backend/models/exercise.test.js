const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Exercise} = require('../models/exercise');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testExerciseId,
    testMuscleGroupsId,
    testEquipmentId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", function(){
    test('works', async function() {
        let exercises = await Exercise.findAll(testUserId[0]);

        expect(exercises).toEqual([{
            id: expect.any(Number),
            name: 'Kettle Bell Squats',
            muscle_group: expect.any(Number),
            equipment_id: expect.any(Number)         
        }])
    })
})

describe("find", function(){
    test("works", async function() {
        let exercise = await Exercise.find(testUserId[0], testExerciseId[0]);

        expect(exercise).toEqual({
            id: expect.any(Number),
            name: 'Kettle Bell Squats',
            muscle_group: expect.any(Number),
            equipment_id: expect.any(Number)         
        })
    })
})

describe("add", function() {
    test("works", async function(){
        let data = ({
            name: "test exercise",
            muscle_group: testMuscleGroupsId[0]
        })

        let newExercise = await Exercise.add(data)

        expect(newExercise).toEqual({
            id: expect.any(Number),
            name: "test exercise",
            muscle_group: testMuscleGroupsId[0]
        })
    })
})

describe("update", function(){
    test("works", async function(){
        let data = {
            name: "test exercise update"
        }

        let updatedExercise = await Exercise.update(testExerciseId[0], data, testEquipmentId[0])

        expect(updatedExercise).toEqual({
            id: expect.any(Number),
            name: "test exercise update",
            muscle_group: expect.any(Number)    
        })
    })
})

describe("delete", function(){
    test("works", async function(){
        let res = await db.query(` DELETE FROM exercises WHERE id = ${testExerciseId[0]}`)
        expect(res.rows.length).toEqual(0);
  
    });
});

describe("addUserExercise", function(){
    test("works", async function(){
        let addUserExercise = await Exercise.addUserExercise(testUserId[0], testExerciseId[0]);

    })
})