const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {MuscleGroup} = require('../models/muscleGroup');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testMuscleGroupsId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", function(){
    test('works', async function() {
        let muscleGroups = await MuscleGroup.findAll();

        expect(muscleGroups).toEqual([{
            id: expect.any(Number),
            name: "Hamstrings"
        }])
    })
})

describe("find", function(){
    test("works", async function() {
        let muscle_group = await MuscleGroup.find(testMuscleGroupsId[0]);

        expect(muscle_group).toEqual({
            id: expect.any(Number),
            name: "Hamstrings"
        })
    })
})