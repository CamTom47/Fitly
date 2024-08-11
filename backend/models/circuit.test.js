const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Circuit} = require('../models/circuit');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testCircuitId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", async function(){

    test('works', async function() {
        console.log(testUserId[0])
        let circuits = await Circuit.findAll(testUserId[0]);
        expect(circuits).toEqual(
             [{
                id: expect.any(Number),
                sets: 5,
                reps: 10,
                weight: 100,
                rest_period: 60,
                intensity: "medium",
                workout_id: expect.any(Number)
             }]
        );
    })
})

// describe("find", function(){
//     test("works", async function() {
//         let category = await Category.find(testCategoryId[0]);
//         expect(category).toEqual(
//             {
//                 id: expect.any(Number),
//                 user_id: expect.any(Number),
//                 name:"HIIT"
//             }
//         )
//     })
// })

// describe("add")

// describe("update")

// describe("delete")