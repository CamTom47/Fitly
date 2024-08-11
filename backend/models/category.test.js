const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Category} = require('../models/category');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testCategoryId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", async function(){

    test('works', async function() {
        let categories = await Category.findAll(testUserId[0]);
        expect(categories).toEqual(
             [{
                id: expect.any(Number),
                user_id: expect.any(Number),
                name: "HIIT",
            },{
                id: expect.any(Number),
                user_id: expect.any(Number),
                name: "Plyometrics"
            }]
        );
    })
})

describe("find", function(){
    test("works", async function() {
        let category = await Category.find(testCategoryId[0]);
        expect(category).toEqual(
            {
                id: expect.any(Number),
                user_id: expect.any(Number),
                name:"HIIT"
            }
        )
    })
})